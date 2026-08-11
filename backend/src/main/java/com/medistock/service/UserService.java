package com.medistock.service;

import com.medistock.dto.UserRequest;
import com.medistock.dto.UserResponse;
import com.medistock.entity.User;
import com.medistock.exception.BusinessException;
import com.medistock.exception.ResourceNotFoundException;
import com.medistock.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email '" + request.getEmail() + "' is already registered", "DUPLICATE_EMAIL");
        }

        String role = request.getRole().toUpperCase();
        if (!role.equals("ADMIN") && !role.equals("STAFF")) {
            throw new BusinessException("Role must be ADMIN or STAFF", "INVALID_ROLE");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .active(true)
                .build();
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse toggleStatus(Long id, String currentUserEmail) {
        User user = findById(id);

        // Prevent admin from deactivating their own account
        if (user.getEmail().equals(currentUserEmail)) {
            throw new BusinessException("You cannot deactivate your own account", "SELF_DEACTIVATION");
        }

        user.setActive(!user.getActive());
        return toResponse(userRepository.save(user));
    }

    private User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .active(user.getActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
