import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { ParsedUrlQuery } from 'querystring';
import { defaultMetaProps } from '@/components/layout/meta';
import { getUser, getAllUsers, getUserCount } from '@/lib/api/user';
import clientPromise from '@/lib/mongodb';
import { UserProps } from '@/lib/api/user';

export { default } from '.';

interface Params extends ParsedUrlQuery {
  username: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  console.log('Session :', session)
  if (!session || !session.user) {
    
    return {
      redirect: {
        destination: `/login`,
        permanent: false,
      },
    };
  }

  else if ((context.params as Params).username !== session.username) {
    return {
      redirect: {
        destination: '/catch/${(context.params as Params).username}',
        permanent: false
      }
    };
  }
  
  try {
    await clientPromise;
  } catch (e: any) {
    if (e.code === 'ENOTFOUND') {
      // cluster is still provisioning
      return {
        props: {
          clusterStillProvisioning: true
        }
      };
    } else {
      throw new Error(`Connection limit reached. Please try again later.`);
    }
  }

  const { username } = context.params as Params;
  const user = await getUser(username);
  if (!user) {
    return {
      notFound: true,
    };
  }

  const results = await getAllUsers();
  const totalUsers = await getUserCount();

  const ogUrl = `https://mongodb.vercel.app/${user.username}`;
  const meta = {
    ...defaultMetaProps,
    title: `${user.name}'s Page | MongoDB Starter Kit`,
    ogImage: `https://api.microlink.io/?url=${ogUrl}&screenshot=true&meta=false&embed=screenshot.url`,
    ogUrl: `https://mongodb.vercel.app/${user.username}`
  };

  const client = await clientPromise;
  await client.connect();
  const collection = client.db('user').collection('appointmentTimetable');

  const rawAppointments = await collection.find({ accepterId: user.username }).toArray();
  // console.log("rawAppointments:", rawAppointments);
  // if (!rawAppointments || rawAppointments.length === 0) {
  //   return {
  //     notFound: true,
  //   };
  // }

  const appointments = rawAppointments.map((appointment) => ({
    _id: appointment._id.toString(),
    accepterId: appointment.accepterId,
    senderId: appointment.senderId,
    date: appointment.date,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    isAccepted: appointment.isAccepted,
  }));

  return {
    props: {
      meta,
      results,
      totalUsers,
      user,
      appointments
    }
  };
};
