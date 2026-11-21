import DbUser from '../models/user.js';

export default class AuthController {
    static async register(req, res) { }
    static async login(req, res) { }

    static async refreshJwt(req, res) { }

    static async requestPasswordResetEmail(req, res) { }
    static async requestEmailVerification(req, res) { }
    static async requestPasswordReset(req, res) { }

    static async confirmEmail(req, res) { }
    static async confirmPasswordReset(req, res) { }
}
