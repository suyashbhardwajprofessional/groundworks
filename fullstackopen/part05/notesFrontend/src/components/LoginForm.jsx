const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
 }) => {
 return (
   <div>
     <h2>Login</h2>

     <form onSubmit={handleSubmit}>
      <table>
        <tbody>
          <tr>
            <td>username</td>
            <td>
              <input
                type="text"
                value={username}
                name="Username"
                onChange={handleUsernameChange}
              />
            </td>
          </tr>
          <tr>
            <td>password</td>
            <td>
              <input
                type="password"
                value={password}
                name="Password"
                onChange={handlePasswordChange}
              />
            </td>
          </tr>
        </tbody>
      </table>
      
      <button type="submit">login</button>
    </form>
   </div>
 )
}

export default LoginForm