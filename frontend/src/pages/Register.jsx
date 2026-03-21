import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthLayout from '@/components/layout/AuthLayout'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  countryCode: yup.string().required('Country code is required'),
  phone: yup.string().required('Phone number is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'At least 8 characters')
    .matches(/[A-Z]/, 'Must contain an uppercase letter')
    .matches(/[0-9]/, 'Must contain a number')
    .matches(/[^A-Za-z0-9]/, 'Must contain a special character'),
})

export default function Register() {
  const [loading, setLoading] = useState(false)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = async ({ name, email, countryCode, phone, password }) => {
    setLoading(true)
    try {
      await registerUser({ name, email, countryCode, phone, password })
      toast.success('Account created successfully')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Card>
        <h1 className="text-2xl font-bold text-white text-center mb-2">
          Create your account
        </h1>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Start building with FlowCore
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Full Name"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <div className="flex gap-3">
            <div className="w-28">
              <Input
                label="Code"
                placeholder="+1"
                error={errors.countryCode?.message}
                {...register('countryCode')}
              />
            </div>
            <div className="flex-1">
              <Input
                label="Phone"
                type="tel"
                placeholder="1234567890"
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>
          </div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" loading={loading}>
            Create Account
          </Button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-400 hover:text-sky-300 transition-colors">
            Sign in
          </Link>
        </p>
      </Card>
    </AuthLayout>
  )
}
