package exalt.training.management.exception;

public class InvalidUserAuthenticationException extends RuntimeException {
    public InvalidUserAuthenticationException(String message) {
        super(message);
    }
}
