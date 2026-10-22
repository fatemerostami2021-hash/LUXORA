import { app } from "./app";
import { config } from "./config";

const server = app.listen(config.PORT, () => console.log(`LUXORA API on http://localhost:${config.PORT}`));
const stop = () => server.close(() => process.exit(0));
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
