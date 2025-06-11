import z from "zod";

export const formSchema = z.object({
    name: z.string().min(2 ,{message: 'Name must be atleast 2 characters'}).max(50, {message: 'Name is too long.'}),
    email: z.string().email({message: 'Please enter valid email address'}).min(3, {message: 'Email must be atleast 3 characters'}).max(50, {message: 'Email is too long.'}),
    password: z.string().min(5, {message: 'Password must be atleast 5 characters long'}).max(16, {message: 'Password should be under 16 characters.'}),
})

export const signInFormSchema = formSchema.pick({
  email: true,
  password: true
})