import { useState } from 'react';
import Weeks from './weeks';
import Calendar from './calendar';
// import Calendar from './calendar-catch';
import Appointment, { AppointmentProps as AppointmentType } from './appointment';
import Profile from './profile';
import { UserProps } from '@/lib/api/user';

export interface TabsProps {
    appointments: AppointmentType["appointments"];
    user: UserProps;
}

export default function Tabs({ appointments, user }: TabsProps) {
    const [activeTab, setActiveTab] = useState('1');
    return (
    <div className="w-full">
        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">SoWhen!</h3>
        </div>
        <div className="px-4 py-4 sm:p-6">
            <nav className="relative z-0 rounded-lg shadow flex divide-x divide-gray-200" aria-label="Tabs">
            <button
                onClick={() => setActiveTab('1')}
                className={`group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 focus:z-10 ${activeTab === '1' ? 'text-gray-900' : ''}`}
                aria-current="page"
            >
                <span>약속 현황</span>
                <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-0.5 ${activeTab === '1' ? 'bg-indigo-500' : ''}`}></span>
            </button>

            <button
                onClick={() => setActiveTab('2')}
                className={`group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 focus:z-10 ${activeTab === '2' ? 'text-gray-900' : ''}`}
                aria-current="page"
            >
                <span>나의 주간 일정</span>
                <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-0.5 ${activeTab === '2' ? 'bg-indigo-500' : ''}`}></span>
            </button>

            <button
                onClick={() => setActiveTab('3')}
                className={`group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 focus:z-10 ${activeTab === '3' ? 'text-gray-900' : ''}`}
                aria-current="page"
            >
                <span>이 날은 달라요</span>
                <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-0.5 ${activeTab === '3' ? 'bg-indigo-500' : ''}`}></span>
            </button>
            </nav>
        </div>
        <div className="px-4 py-5 sm:p-6">
            {activeTab === '1' && <Appointment appointments={appointments} />}
            {activeTab === '2' && <Weeks user={user} />}
            {activeTab === '3' && <Calendar user={user} />}
        </div>
        </div>
    </div>
    );
}

