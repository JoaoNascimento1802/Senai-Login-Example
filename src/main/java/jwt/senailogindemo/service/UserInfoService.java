package jwt.senailogindemo.service;

import jwt.senailogindemo.entity.UserInfo;
import jwt.senailogindemo.repository.UserInfoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserInfoService implements UserDetailsService {

    private final UserInfoRepository repository;
    private final PasswordEncoder encoder;
    private static final Logger logger = LoggerFactory.getLogger(UserInfoService.class);

    public UserInfoService(UserInfoRepository repository, PasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<UserInfo> userDetail = repository.findByEmail(username);
        return userDetail
                .map(UserInfoDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public String addUser(UserInfo userInfo) {
        try {
            Optional<UserInfo> existingUser = repository.findByEmail(userInfo.getEmail());
            if (existingUser.isPresent()) {
                logger.warn("User already exists: {}", userInfo.getEmail());
                return "User already exists!";
            }
            userInfo.setPassword(encoder.encode(userInfo.getPassword()));
            repository.save(userInfo);
            logger.info("User added successfully: {}", userInfo.getEmail());
            return "User Added Successfully";
        } catch (Exception e) {
            logger.error("Error adding user: {}", e.getMessage());
            return "Error adding user";
        }
    }
}