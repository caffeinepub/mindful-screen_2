import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Time management
  let userTimeLimits = Map.empty<Principal, Nat>();
  let sessionRecords = Map.empty<Principal, List.List<(Int, Int)>>();
  var idCounter = 0;

  // Notes
  public type Note = {
    id : Nat;
    title : Text;
    content : Text;
    timestamp : Int;
  };

  module Note {
    public func compareByTimestamp(note1 : Note, note2 : Note) : Order.Order {
      Int.compare(note1.timestamp, note2.timestamp);
    };
    public func compareById(note1 : Note, note2 : Note) : Order.Order {
      Nat.compare(note1.id, note2.id);
    };
  };

  let userNotes = Map.empty<Principal, List.List<Note>>();

  // User Profiles
  public type UserProfile = {
    name : Text;
    // Future metadata fields could go here (avatar, preferences, etc.)
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // USER PROFILE MANAGEMENT

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // SESSION AND TIME MANAGEMENT

  public shared ({ caller }) func setDailyTimeLimit(minutes : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: This action requires authentication");
    };
    userTimeLimits.add(caller, minutes);
  };

  public query ({ caller }) func getDailyTimeLimit() : async ?Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: This action requires authentication");
    };
    userTimeLimits.get(caller);
  };

  public shared ({ caller }) func saveSessionRecord(startTime : Int, endTime : Int) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: This action requires authentication");
    };
    let sessions = switch (sessionRecords.get(caller)) {
      case (null) { List.empty<(Int, Int)>() };
      case (?existing) { existing };
    };
    sessions.add((startTime, endTime));
    sessionRecords.add(caller, sessions);
  };

  public query ({ caller }) func getAllSessionRecords() : async [(Int, Int)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: This action requires authentication");
    };
    switch (sessionRecords.get(caller)) {
      case (null) { Runtime.trap("No session records found") };
      case (?recordsList) { recordsList.toArray() };
    };
  };

  public query ({ caller }) func getTodaysSessionRecords(dayStartTimestamp : Int) : async [(Int, Int)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: This action requires authentication");
    };
    switch (sessionRecords.get(caller)) {
      case (null) { [] };
      case (?allSessions) {
        allSessions.filter(
          func(record) {
            let (start, _) = record;
            start >= dayStartTimestamp
          }
        ).toArray();
      };
    };
  };

  public shared ({ caller }) func clearAllRecords() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: This action requires authentication");
    };
    sessionRecords.remove(caller);
  };

  // NOTES MANAGEMENT

  public shared ({ caller }) func createNote(title : Text, content : Text, timestamp : Int) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: This action requires authentication");
    };
    idCounter += 1;
    let note : Note = {
      id = idCounter;
      title;
      content;
      timestamp;
    };
    let existingNotes = switch (userNotes.get(caller)) {
      case (null) { List.empty<Note>() };
      case (?list) { list };
    };
    existingNotes.add(note);
    userNotes.add(caller, existingNotes);
    note.id;
  };

  public query ({ caller }) func getNoteById(noteId : Nat) : async ?Note {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: This action requires authentication");
    };
    switch (userNotes.get(caller)) {
      case (null) { null };
      case (?userNotesList) {
        switch (userNotesList.find(func(note) { note.id == noteId })) {
          case (null) { null };
          case (?found) { ?found };
        };
      };
    };
  };

  public query ({ caller }) func getAllNotes() : async [Note] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: This action requires authentication");
    };
    switch (userNotes.get(caller)) {
      case (null) { Runtime.trap("No notes found") };
      case (?notesList) { notesList.toArray() };
    };
  };

  public query ({ caller }) func getAllNotesSortedByTimestamp() : async [Note] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: This action requires authentication");
    };
    switch (userNotes.get(caller)) {
      case (null) { [] };
      case (?notesList) {
        notesList.toArray().sort(Note.compareByTimestamp);
      };
    };
  };

  public shared ({ caller }) func updateNote(noteId : Nat, newTitle : Text, newContent : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: This action requires authentication");
    };
    switch (userNotes.get(caller)) {
      case (null) { Runtime.trap("Note not found") };
      case (?notesList) {
        let updatedNotes = notesList.map<Note, Note>(
          func(note) {
            if (note.id == noteId) {
              {
                id = note.id;
                title = newTitle;
                content = newContent;
                timestamp = note.timestamp;
              };
            } else { note };
          }
        );
        userNotes.add(caller, updatedNotes);
      };
    };
  };

  public shared ({ caller }) func deleteNote(noteId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: This action requires authentication");
    };
    switch (userNotes.get(caller)) {
      case (null) { Runtime.trap("Note not found") };
      case (?notesList) {
        let filteredNotes = List.empty<Note>();
        notesList.forEach(
          func(note) {
            if (note.id != noteId) {
              filteredNotes.add(note);
            };
          }
        );
        userNotes.add(caller, filteredNotes);
      };
    };
  };
};
