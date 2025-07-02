# Use a slim OpenJDK image for a smaller footprint
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven wrapper executable and the wrapper configuration
COPY mvnw .
COPY .mvn ./.mvn

# Copy the pom.xml to leverage Docker's layer caching
COPY pom.xml .

# Make the mvnw script executable
RUN chmod +x mvnw

# --- START: ADDED COMMANDS TO FIX SSL/TLS ERROR ---

# Install OpenSSL to handle certificates and clean up afterward
RUN apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# Download the SSL certificate from the Brevo SMTP server
RUN openssl s_client -connect smtp-relay.brevo.com:587 -starttls smtp < /dev/null 2>/dev/null | openssl x509 -outform pem > /tmp/brevo.pem

# Import the downloaded certificate into the Java's default truststore
# The default password for the Java truststore is "changeit"
RUN keytool -import -trustcacerts -keystore "$JAVA_HOME/lib/security/cacerts" -storepass changeit -noprompt -alias brevo.com -file /tmp/brevo.pem

# --- END: ADDED COMMANDS ---

# Download dependencies. This will use the pom.xml to download all necessary libraries.
RUN ./mvnw dependency:go-offline

# Copy the rest of the application source code
COPY src ./src

# Package the application into a JAR file, skipping tests
RUN ./mvnw package -DskipTests

# Expose the port the application will run on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java","-jar","target/demo-0.0.1-SNAPSHOT.jar"]