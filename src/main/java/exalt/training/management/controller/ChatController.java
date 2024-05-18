package exalt.training.management.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.ChatClient;
import org.springframework.ai.chat.ChatResponse;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatClient;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class ChatController {


    @GetMapping("/search")
    public ResponseEntity<String> searchResources(@RequestParam String prompt, @RequestParam String key) {
        if (!isValidApiKey(key)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid API key");
        }

        // Use the validated key to interact with the Gemini API
        String resources = retrieveResourcesFromGemini(prompt, key);

        return ResponseEntity.ok(resources); // Assuming response is a string
    }

    // Method to validate the API key (replace with your actual implementation)
    private boolean isValidApiKey(String key) {
        // Implement logic to check if the key is valid (e.g., call Gemini API with the key)
        return true; // Replace with actual validation logic
    }

    // Method to interact with the Gemini API (replace with your actual implementation)
    private String retrieveResourcesFromGemini(String prompt, String key) {
        // Use the provided key to make API calls to Gemini and retrieve resources
        return "Resources retrieved from Gemini API (replace with actual implementation)";
    }



}