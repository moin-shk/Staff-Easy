import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

// Helper component for dashboard cards (admin/manager view)
const DashboardCard = ({ title, value, icon, bgColor, path }) => (
  <div className={`${bgColor} rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  </div>
);

// Helper component for quick action links (admin/manager view)
const QuickAction = ({ icon, title, path }) => (
  <a
    href={path}
    className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-50 transition-colors text-center"
  >
    <span className="text-2xl mb-2">{icon}</span>
    <span className="text-sm font-medium text-gray-700">{title}</span>
  </a>
);

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Get username from context or fallback to localStorage
  let username = user?.username || 'User';
  try {
    if (!user) {
      const storedUser = JSON.parse(localStorage.getItem('staffeasy_user'));
      if (storedUser) {
        username = storedUser.username || storedUser.email || 'User';
      }
    }
  } catch (e) {
    console.error('Error parsing stored user', e);
  }

  const accessDenied = location.state?.accessDenied;
  const accessMessage = location.state?.message;

  // --- ADMIN & MANAGER DASHBOARD LOGIC ---
  const [employeesCount, setEmployeesCount] = useState(0);
  const [teamsCount, setTeamsCount] = useState(0);
  const [pendingTimeOff, setPendingTimeOff] = useState(0);
  const [totalPayroll, setTotalPayroll] = useState(0);
  const [activity, setActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [errorActivity, setErrorActivity] = useState('');

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'manager')) {
      async function fetchMetricsAndActivity() {
        // Employee count
        const { count: empCount, error: countError } = await supabase
          .from('employees')
          .select('id', { head: true, count: 'exact' });
        if (!countError) {
          setEmployeesCount(empCount || 0);
        } else {
          console.error('Error fetching employee count:', countError);
        }

        // Total payroll
        const { data: empSalaries, error: salaryError } = await supabase
          .from('employees')
          .select('salary');
        if (!salaryError && empSalaries) {
          const total = empSalaries.reduce((acc, cur) => acc + Number(cur.salary || 0), 0);
          setTotalPayroll(total);
        } else {
          console.error('Error fetching salaries:', salaryError);
        }

        // Teams count (distinct teams)
        const { data: empTeams, error: teamError } = await supabase
          .from('employees')
          .select('team');
        if (!teamError && empTeams) {
          const distinctTeams = new Set(empTeams.map(emp => emp.team).filter(team => team));
          setTeamsCount(distinctTeams.size);
        } else {
          console.error('Error fetching teams:', teamError);
        }

        // Pending time-off requests (from time_off_requests table)
        const { count: toCount, error: toError } = await supabase
          .from('time_off_requests')
          .select('id', { head: true, count: 'exact' })
          .eq('timeoff_requested', true);
        if (!toError) {
          setPendingTimeOff(toCount || 0);
        } else {
          console.error('Error fetching time-off requests:', toError);
        }

        // Recent activity from "activity" table (excluding time-off request updates)
        const { data: actData, error: actError } = await supabase
          .from('activity')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(5);
        if (actError) {
          console.error('Error fetching activity:', actError);
          setErrorActivity('Failed to load recent activity');
        } else {
          // Filter out time-off request updates if needed.
          const filteredActivity = actData.filter(act => act.type !== 'Time-off Request');
          setActivity(filteredActivity);
        }
        setLoadingActivity(false);
      }
      fetchMetricsAndActivity();
    }
  }, [user]);

  // --- NORMAL USER DASHBOARD LOGIC ---
  const [myEmployee, setMyEmployee] = useState(null);
  const [loadingMyEmp, setLoadingMyEmp] = useState(true);
  const [errorMyEmp, setErrorMyEmp] = useState('');
  const [alertMsg, setAlertMsg] = useState(null);

  useEffect(() => {
    if (user && user.role === 'user') {
      async function fetchMyEmployee() {
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .eq('email', user.email)
          .single();
        if (error) {
          console.error('Error fetching your employee data:', error);
          setErrorMyEmp('Could not fetch your employee data.');
        } else {
          setMyEmployee(data);
        }
        setLoadingMyEmp(false);
      }
      fetchMyEmployee();
    }
  }, [user]);

  // For a normal user, update time_off_requests (instead of the employees table)
  const handleRequestTimeOff = async () => {
    if (!myEmployee) return;
    const { error } = await supabase
      .from('time_off_requests')
      .update({ timeoff_requested: true })
      .eq('employee_id', myEmployee.id);
    if (error) {
      setAlertMsg({ type: 'error', text: 'Failed to request time off.' });
    } else {
      setAlertMsg({ type: 'success', text: 'Time off requested successfully.' });
      // Optionally, update local state if you store the current request status
      setMyEmployee({ ...myEmployee, timeoff_request: true });
    }
  };

  const handleWithdrawTimeOff = async () => {
    if (!myEmployee) return;
    const { error } = await supabase
      .from('time_off_requests')
      .update({ timeoff_requested: false })
      .eq('employee_id', myEmployee.id);
    if (error) {
      setAlertMsg({ type: 'error', text: 'Failed to withdraw time off request.' });
    } else {
      setAlertMsg({ type: 'success', text: 'Time off request withdrawn successfully.' });
      setMyEmployee({ ...myEmployee, timeoff_request: false });
    }
  };

  // --- RENDERING ---
  if (user && (user.role === 'admin' || user.role === 'manager')) {
    // For admins/managers, show complete dashboard metrics
    const dynamicDashboardCards = [
      { title: 'Employees', value: employeesCount, icon: '👥', bgColor: 'bg-blue-50', path: '/employees' },
      { title: 'Teams', value: teamsCount, icon: '🏢', bgColor: 'bg-green-50', path: '/teams' },
      { title: 'Time-off Requests', value: pendingTimeOff, icon: '📅', bgColor: 'bg-yellow-50', path: '/time-off' },
      { title: 'Payroll', value: totalPayroll ? `$${totalPayroll}` : '$0', icon: '💰', bgColor: 'bg-purple-50', path: '/payroll' },
    ];

    return (
      <div className="max-w-6xl mx-auto p-4">
        {accessDenied && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {accessMessage || 'You do not have permission to access the requested page.'}
                </p>
              </div>
            </div>
          </div>
        )}
        <section className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Welcome back, {username}</h1>
          <p className="text-gray-600">Here's what's happening with your organization today.</p>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dynamicDashboardCards.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="bg-white rounded-lg shadow-md p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickAction icon="👤" title="Add Employee" path="/add-employee" />
            <QuickAction icon="🗂️" title="Manage Teams" path="/teams" />
            <QuickAction icon="📋" title="Review Time-off" path="/time-off" />
            <QuickAction icon="📊" title="View Analytics" path="/analytics" />
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          {loadingActivity ? (
            <p className="text-gray-600">Loading recent activity...</p>
          ) : errorActivity ? (
            <p className="text-red-500">{errorActivity}</p>
          ) : activity.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      When
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      By
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activity.map(act => (
                    <tr key={act.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{act.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{act.action}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{act.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(act.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{act.user_name || act.user_email || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No recent activity found.</p>
          )}
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Employees</h2>
          {/* You might include a table here for admin/manager view, as before */}
          {/* ... */}
        </section>
      </div>
    );
  } else if (user && user.role === 'user') {
    // NORMAL USER DASHBOARD: Show personal employee data and time-off request options using the new time_off_requests table.
    const [myEmployee, setMyEmployee] = useState(null);
    const [loadingMyEmp, setLoadingMyEmp] = useState(true);
    const [errorMyEmp, setErrorMyEmp] = useState('');
    const [alertMsg, setAlertMsg] = useState(null);
    const [myTimeoff, setMyTimeoff] = useState(false); // local state for time-off request

    useEffect(() => {
      async function fetchMyEmployee() {
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .eq('email', user.email)
          .single();
        if (error) {
          console.error('Error fetching your employee data:', error);
          setErrorMyEmp('Could not fetch your employee data.');
        } else {
          setMyEmployee(data);
          // Fetch corresponding time_off_request row for this employee
          const { data: tofData, error: tofError } = await supabase
            .from('time_off_requests')
            .select('timeoff_requested')
            .eq('employee_id', data.id)
            .single();
          if (tofError) {
            console.error('Error fetching time-off request status:', tofError);
          } else if (tofData) {
            setMyTimeoff(tofData.timeoff_requested);
          }
        }
        setLoadingMyEmp(false);
      }
      fetchMyEmployee();
    }, [user.email]);

    const handleRequestTimeOff = async () => {
      if (!myEmployee) return;
      const { error } = await supabase
        .from('time_off_requests')
        .update({ timeoff_requested: true })
        .eq('employee_id', myEmployee.id);
      if (error) {
        setAlertMsg({ type: 'error', text: 'Failed to request time off.' });
      } else {
        setMyTimeoff(true);
        setAlertMsg({ type: 'success', text: 'Time off requested successfully.' });
      }
    };

    const handleWithdrawTimeOff = async () => {
      if (!myEmployee) return;
      const { error } = await supabase
        .from('time_off_requests')
        .update({ timeoff_requested: false })
        .eq('employee_id', myEmployee.id);
      if (error) {
        setAlertMsg({ type: 'error', text: 'Failed to withdraw time off request.' });
      } else {
        setMyTimeoff(false);
        setAlertMsg({ type: 'success', text: 'Time off request withdrawn successfully.' });
      }
    };

    if (loadingMyEmp) {
      return <div className="max-w-4xl mx-auto p-4">Loading your data...</div>;
    }
    if (errorMyEmp) {
      return <div className="max-w-4xl mx-auto p-4 text-red-500">{errorMyEmp}</div>;
    }
    if (!myEmployee) {
      return <div className="max-w-4xl mx-auto p-4">You are not an employee.</div>;
    }

    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h2>
          {alertMsg && (
            <div className={`mb-4 p-4 rounded ${alertMsg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {alertMsg.text}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-700"><strong>Name:</strong> {myEmployee.name}</p>
              <p className="text-gray-700"><strong>Position:</strong> {myEmployee.position}</p>
              <p className="text-gray-700"><strong>Department:</strong> {myEmployee.department}</p>
              <p className="text-gray-700"><strong>Email:</strong> {myEmployee.email}</p>
            </div>
            <div>
              <p className="text-gray-700"><strong>Phone:</strong> {myEmployee.phone || 'N/A'}</p>
              <p className="text-gray-700"><strong>Salary:</strong> {myEmployee.salary ? `$${myEmployee.salary}` : 'N/A'}</p>
              <p className="text-gray-700"><strong>Team:</strong> {myEmployee.team || 'N/A'}</p>
              <p className="text-gray-700"><strong>Time-off Request:</strong> {myTimeoff ? 'Requested' : 'Not Requested'}</p>
            </div>
          </div>
          <div className="mt-6 flex space-x-4">
            {!myTimeoff ? (
              <button
                onClick={handleRequestTimeOff}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Request Time Off
              </button>
            ) : (
              <button
                onClick={handleWithdrawTimeOff}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Withdraw Request
              </button>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return <div className="max-w-6xl mx-auto p-4">Please log in to view the dashboard.</div>;
  }
};

export default Dashboard;
