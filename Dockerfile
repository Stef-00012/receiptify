FROM oven/bun:slim

WORKDIR /receiptify

COPY . .

RUN bun install
RUN bun run build

ENTRYPOINT ["bun", "run", "start"]