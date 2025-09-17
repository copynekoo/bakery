import postgres from 'postgres'
import 'dotenv/config'

const sql = postgres();

export default sql;