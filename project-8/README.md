# MediBook — Multi-Role Doctor Appointment Portal

An Advanced React project built for teaching. It shows how to combine
**React Router**, **Context**, and a **custom hook** to build a real
app with three different user roles.

## What students learn

- **React Router**: multiple pages controlled by the URL (`<Routes>`, `<Route>`, `<Link>`, `useNavigate`).
- **Context API**: sharing data across the whole app without prop drilling
  (`AuthContext` for login, `DataContext` for doctors & appointments).
- **Custom hook**: `useLocalStorage` saves state so a page refresh keeps your data.
- **Protected / role-based routes**: a reusable `<ProtectedRoute>` guard that
  checks login + role before showing a page.
- **Conditional rendering**: the navbar and buttons change based on the role.

## The three roles

| Role    | Can do                                                      |
| ------- | ----------------------------------------------------------- |
| Patient | Book appointments and see their own appointment status      |
| Doctor  | See their own patients' requests and approve / reject them  |
| Admin   | See every appointment, view stats, and cancel appointments  |

## Demo logins

| Role    | Email          | Password  |
| ------- | -------------- | --------- |
| Admin   | admin@med.com  | `admin`   |
| Doctor  | rao@med.com    | `doctor`  |
| Patient | sam@med.com    | `patient` |

(There's also `mehta@med.com` / `doctor` for a second doctor.)

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Project structure

```
src/
  main.jsx                  # wraps app with Router + Auth + Data providers
  App.jsx                   # all the routes + role guards
  index.css                 # Tailwind styles
  hooks/
    useLocalStorage.js      # custom hook: state that survives refresh
  context/
    AuthContext.jsx         # who is logged in + their role
    DataContext.jsx         # doctors + appointments + actions
  data/
    seed.js                 # fake "database" of users/doctors/appointments
  components/
    Navbar.jsx              # top bar, links change by role
    ProtectedRoute.jsx      # guards a page by login + role
  pages/
    Home.jsx
    Login.jsx
    Doctors.jsx
    NoAccess.jsx
    AdminDashboard.jsx
    DoctorDashboard.jsx
    PatientDashboard.jsx
```
