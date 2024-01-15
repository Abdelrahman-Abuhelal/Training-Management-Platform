package exalt.training.management.exception;

public class AccountAlreadyActivatedException extends RuntimeException {

    public AccountAlreadyActivatedException(String message){
        super(message);
    }
}