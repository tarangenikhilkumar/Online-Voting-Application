package com.votingsystem.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.votingsystem.entity.User;
import com.votingsystem.entity.enums.AccountStatus;
import com.votingsystem.entity.enums.Role;

import lombok.Getter;

@Getter
public class CustomUserDetails implements UserDetails {

    private static final long serialVersionUID = 1L;

    private final Long id;
    private final String fullName;
    private final String email;
    private final String passwordHash;
    private final Role role;
    private final boolean active;

    private CustomUserDetails(Long id, String fullName, String email, String passwordHash,
                              Role role, boolean active) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.active = active;
    }

    public static CustomUserDetails from(User user) {
        return new CustomUserDetails(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getRole(),
                user.getAccountStatus() == AccountStatus.ACTIVE);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}