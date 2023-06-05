import {useState} from 'react'
 
const Auth = () => {
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')
   const [register, setRegister] = useState(true)
 
   const submitHandler = e => {
       e.preventDefault()
 
       console.log('submitHandler called')
   }
 
   return (
       <main>
           <h1>Welcome!</h1>
           <form className='form auth-form' onSubmit={submitHandler}>
               <input
                   className='form-input'/>
               <input
                   className='form-input'/>
               <button className='form-btn'>
                   {register ? 'Sign Up' : 'Login'}
               </button>
           </form>
           <button className='form-btn'>Need to {register ? 'Login' : 'Sign Up'}?</button>
       </main>
   )
}
 
export default Auth