package com.votingsystem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.votingsystem.entity.Vote;

@Repository
public interface VoteRepository extends JpaRepository<Vote, String> {

    interface CandidateVoteCount {
        Long getElectionCandidateId();

        Long getVotes();
    }

    interface ElectionVoteCount {
        Long getElectionId();

        Long getVotes();
    }

    long countByElectionId(Long electionId);

    long countByElectionIdAndElectionCandidateId(Long electionId, Long electionCandidateId);

    @Query("""
            select v.electionCandidateId as electionCandidateId, count(v) as votes
            from Vote v
            where v.electionId = :electionId
            group by v.electionCandidateId
            """)
    List<CandidateVoteCount> countVotesByCandidate(@Param("electionId") Long electionId);

    @Query("""
            select v.electionId as electionId, count(v) as votes
            from Vote v
            group by v.electionId
            """)
    List<ElectionVoteCount> countVotesByElection();
}