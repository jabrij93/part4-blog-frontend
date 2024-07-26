const LoginForm = ({
    handleSubmit,
    handleCancel,
    handleUsernameChange,
    handlePasswordChange,
    username,
    password
   }) => {
   return (
     <div>
       <h2>Login</h2>
 
       <form onSubmit={handleSubmit}>
         <div>
           username
           <input
             value={username}
             onChange={handleUsernameChange}
           />
         </div>
         <div>
           password
           <input
             type="password"
             value={password}
             onChange={handlePasswordChange}
           />
       </div>
       <div style={{ display: 'flex', alignItems: 'center' }}>
        <button type="submit">login</button>
        <button type="button" onClick={handleCancel} style={{ marginLeft: '10px' }}>
          cancel
        </button>
      </div>
       </form>
     </div>
   )
 }
 
 export default LoginForm