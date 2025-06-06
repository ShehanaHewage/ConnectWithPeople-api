import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import dotenv from 'dotenv'
import logger from './utils/logger.ts'
import { prettyJSON } from 'hono/pretty-json'
import healthRoutes from './handlers/health.ts'
import userRoutes from './handlers/user.ts'
import uploadRoute from './handlers/upload.ts'
import fileRoutes from './handlers/fileHandler.ts'
import postRoutes from './handlers/posts.ts';
dotenv.config()

import { cors } from 'hono/cors'

const app = new Hono()

app.use("/api/*", cors());
app.use('*', prettyJSON())

app.route('/api/health', healthRoutes)
app.route('/api/user', userRoutes)
app.route("/api", uploadRoute)
app.route('/api', fileRoutes)
app.route('/api/posts', postRoutes)

const port = parseInt(process.env.PORT || '8080')
logger.info(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
