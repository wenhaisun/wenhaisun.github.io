# Base image: Ruby with necessary dependencies for Jekyll
FROM ruby:3.2.2-bookworm@sha256:bc2b1b2c5cf0423b9ca12f2c2196c51efa80c8d3d4d0cf01858e67dc2c7136e4

# Use a dated Debian snapshot so package resolution is reproducible.
RUN printf '%s\n' \
    'deb [check-valid-until=no] http://snapshot.debian.org/archive/debian/20250101T000000Z bookworm main' \
    > /etc/apt/sources.list \
    && rm -f /etc/apt/sources.list.d/debian.sources \
    && apt-get update \
    && apt-get install -y \
    --no-install-recommends \
    build-essential \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the locked Ruby dependency graph into the container.
COPY Gemfile Gemfile.lock ./

# Install the pinned Bundler and dependencies without re-resolving the graph.
RUN gem install bundler:2.4.7 && bundle _2.4.7_ install --jobs 4 --retry 3 --frozen

# Command to serve the Jekyll site
CMD ["jekyll", "serve", "-H", "0.0.0.0", "-w", "--config", "_config.yml,_config_docker.yml"]
