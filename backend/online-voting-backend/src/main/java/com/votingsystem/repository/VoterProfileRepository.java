package com.votingsystem.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.votingsystem.entity.VoterProfile;

@Repository
public interface VoterProfileRepository extends JpaRepository<VoterProfile, Long> {

    Optional<VoterProfile> findByUserId(Long userId);

    boolean existsByVoterIdNumber(String voterIdNumber);
}