package exalt.training.management.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender javaMailSender;

    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @Async
    public void sendEmail(MimeMessage email) {
        javaMailSender.send(email);
    }

    public MimeMessage createMimeMessage(String toEmail, String subject, String htmlContent) throws MessagingException, MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true); // true indicates multipart message

        messageHelper.setTo(toEmail);
        messageHelper.setSubject(subject);
        messageHelper.setText(htmlContent, true); // true indicates HTML content

        // Add more properties as needed (e.g., CC, BCC, attachments)

        return mimeMessage;
    }
}