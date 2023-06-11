import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.REACT_APP_JWT_SECRET, {
        expiresIn: '30d'
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.REACT_APP_NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });
};

export default generateToken;