package com.example.training.exception;

public class AppUserNotFoundException extends RuntimeException {

    public AppUserNotFoundException(String message){
        super(message);
    }
}
