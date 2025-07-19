import Time "mo:base/Time";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Map "mo:motoko-hash-map/Map";

actor BallotLife {
  let { nhash; phash; thash } = Map;

  type Ballot = {
    voter : Principal;
    candidate : Text;
    timestamp : Int;
  };

  type Poll = {
    id : Nat;
    name : Text;
    ballotingOpen : Bool;
    creator : Principal;
    ballots : Map.Map<Principal, Ballot>;
    ballotCount : Map.Map<Text, Nat>;
    candidates : List.List<Text>;
  };

  type PollDetail = {
    id : Nat;
    name : Text;
    ballotingOpen : Bool;
    creator : Principal;
    ballots : [Ballot];
    ballotCount : [(Text, Nat)];
    candidates : [Text];
  };

  type PollSummary = {
    id : Nat;
    name : Text;
    ballotingOpen : Bool;
    creator : Principal;
  };

  stable var nextPollId : Nat = 0;
  stable let polls : Map.Map<Nat, Poll> = Map.new();

  // Create a new poll
  public shared ({ caller }) func createPoll(name : Text) : async Nat {
    if (Principal.isAnonymous(caller)) {
      Debug.trap("Anonymous caller");
    };
    let id = nextPollId;
    nextPollId += 1;
    let newPoll : Poll = {
      id = id;
      name = name;
      ballotingOpen = true;
      creator = caller;
      ballots = Map.new();
      ballotCount = Map.new();
      candidates = List.nil();
    };
    Map.set(polls, nhash, id, newPoll);
    return id;
  };

  public query func getPolls() : async [PollSummary] {
    return Array.map<Poll, PollSummary>(Iter.toArray(Map.vals(polls)), func(p) { { id = p.id; name = p.name; ballotingOpen = p.ballotingOpen; creator = p.creator } });
  };

  public query func getPollDetail(pollId : Nat) : async PollDetail {
    switch (Map.get(polls, nhash, pollId)) {
      case (null) { Debug.trap("Poll not found") };
      case (?poll) {
        return {
          id = poll.id;
          name = poll.name;
          ballotingOpen = poll.ballotingOpen;
          creator = poll.creator;
          ballots = Iter.toArray(Map.vals(poll.ballots));
          ballotCount = Iter.toArray(Map.entries(poll.ballotCount));
          candidates = List.toArray(poll.candidates);
        };
      };
    };
  };

  public shared ({ caller }) func addCandidate(pollId : Nat, candidate : Text) : async Text {
    if (Principal.isAnonymous(caller)) {
      Debug.trap("Anonymous caller");
    };
    switch (Map.get(polls, nhash, pollId)) {
      case (null) { return "Poll not found." };
      case (?poll) {
        if (List.some<Text>(poll.candidates, func(c) { c == candidate })) {
          return "Candidate already exists.";
        } else {
          let updatedPoll = {
            poll with candidates = List.push(candidate, poll.candidates)
          };
          Map.set(polls, nhash, pollId, updatedPoll);
          Map.set(updatedPoll.ballotCount, thash, candidate, 0);
          return "Candidate added successfully!";
        };
      };
    };
  };

  // Close balloting (only the creator can close it)
  public shared ({ caller }) func closeBalloting(pollId : Nat) : async Text {
    if (Principal.isAnonymous(caller)) {
      Debug.trap("Anonymous caller");
    };
    switch (Map.get(polls, nhash, pollId)) {
      case (null) { return "Poll not found." };
      case (?poll) {
        if (caller != poll.creator) {
          return "Only the poll creator can close balloting.";
        };
        let updatedPoll = { poll with ballotingOpen = false };
        Map.set(polls, nhash, pollId, updatedPoll);
        return "Balloting has been closed.";
      };
    };
  };

  // Reopen balloting (only the creator can reopen it)
  public shared ({ caller }) func reopenBalloting(pollId : Nat) : async Text {
    if (Principal.isAnonymous(caller)) {
      Debug.trap("Anonymous caller");
    };
    switch (Map.get(polls, nhash, pollId)) {
      case (null) { return "Poll not found." };
      case (?poll) {
        if (caller != poll.creator) {
          return "Only the poll creator can reopen balloting.";
        };
        let updatedPoll = { poll with ballotingOpen = true };
        Map.set(polls, nhash, pollId, updatedPoll);
        return "Balloting has been reopened.";
      };
    };
  };

  // Cast ballot function
  public shared ({ caller }) func castBallot(pollId : Nat, candidate : Text) : async Text {
    if (Principal.isAnonymous(caller)) {
      Debug.trap("Anonymous caller");
    };
    switch (Map.get(polls, nhash, pollId)) {
      case (null) { return "Poll not found." };
      case (?poll) {
        if (not poll.ballotingOpen) {
          return "Balloting is closed for this poll.";
        };

        if (not List.some<Text>(poll.candidates, func(c) { c == candidate })) {
          return "Invalid candidate.";
        };

        switch (Map.get(poll.ballots, phash, caller)) {
          case (?_) { return "You have already voted!" };
          case (null) {
            let currentTime = Time.now();
            let ballot = {
              voter = caller;
              candidate = candidate;
              timestamp = currentTime;
            };
            Map.set(poll.ballots, phash, caller, ballot);

            switch (Map.get(poll.ballotCount, thash, candidate)) {
              case (?count) {
                Map.set(poll.ballotCount, thash, candidate, count + 1);
              };
              case (null) { Map.set(poll.ballotCount, thash, candidate, 1) };
            };
            Map.set(polls, nhash, pollId, poll);
            return "Ballot recorded successfully!";
          };
        };
      };
    };
  };
};