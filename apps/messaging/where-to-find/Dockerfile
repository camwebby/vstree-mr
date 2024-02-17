FROM oven/bun

# Receive env vars
# ARG GHUB_TOKEN

# Set environment variables
# ENV GHUB_TOKEN=$GHUB_TOKEN


# Copy the lock and package file
COPY bun.lockb . 
COPY package.json . 

# Install dependencies
RUN bun install --frozen-lockfile

# Copy your source code
# If only files in the src folder changed, this is the only step that gets executed!
COPY src ./src 



EXPOSE 3000

CMD ["bun", "run", "start"]
