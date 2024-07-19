import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App'

const blogs = ['']

ReactDOM.createRoot(document.getElementById('root')).render(<App blogs={blogs} />)