package com.votingsystem.exception;

public class DuplicateVoteException extends RuntimeException {

    public DuplicateVoteException() {
        super("You have already voted in this election");
    }
}