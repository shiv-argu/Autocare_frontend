import api from './client';

export async function login(email,password)
{
    const form = new URLSearchParams();
    form.append('username',email);
    form.append('password',password    );
    const res =await api.post('/auth/login',form);
    return res.data.access_token;
}

