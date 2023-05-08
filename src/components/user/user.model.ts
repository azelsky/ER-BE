import { pool } from '../../config/db.config';

export async function userEmailExist(email: string): Promise<boolean> {
  try {
    const res = await pool.query(
      `
                SELECT * 
                FROM users
                WHERE email = $1
            `,
      [email]
    );

    return Boolean(res.rows[0]);
  } catch (error) {
    console.error('Error in userEmailExist:', error);
    throw new Error('Error checking user email existence');
  }
}
