package com.votingsystem.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.votingsystem.entity.VoterParticipation;

@Repository
public interface VoterParticipationRepository extends JpaRepository<VoterParticipation, Long> {

    boolean existsByElectionIdAndUserId(Long electionId, Long userId);

    long countByElectionId(Long electionId);

    long countByUserId(Long userId);

    @EntityGraph(attributePaths = { "election" })
    Page<VoterParticipation> findByUserId(Long userId, Pageable pageable);

    @Query("""
            select vp.election.id from VoterParticipation vp
            where vp.user.id = :userId and vp.election.id in :electionIds
            """)
    List<Long> findVotedElectionIds(@Param("userId") Long userId,
                                    @Param("electionIds") Collection<Long> electionIds);
}