package com.votingsystem.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.votingsystem.entity.PasswordResetToken;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    @EntityGraph(attributePaths = { "user" })
    Optional<PasswordResetToken> findByToken(String token);

    @Modifying
    @Query("delete from PasswordResetToken t where t.user.id = :userId")
    void deleteAllByUserId(@Param("userId") Long userId);

    @Modifying
    @Query("delete from PasswordResetToken t where t.expiryDate < :now")
    int deleteExpired(@Param("now") LocalDateTime now);
}