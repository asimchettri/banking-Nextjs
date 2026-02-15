import HeaderBox from '@/components/HeaderBox'
import RightSideBar from '@/components/RightSideBar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import React from 'react'

const Home = () => {

  const loggedIn ={firstName:'Asim',lastname:'chettri' ,email:'asim.chettri@gmail.com'};

  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
            type="greeting"
            title="welcome "
            user={loggedIn ?.firstName|| 'Guest' }
            subtext ="Access and manage your account and transactions efficiently"
            />

            <TotalBalanceBox
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={12780.70}
            
            />
        </header>

        RECENT TRANSACTIOMS
      </div>

      <RightSideBar  
      user={loggedIn}
      transactions={[]}
      banks={[{currentBalance:12323},{ currentBalance:500000}]}
      
      
      />
    </section>
  )
}

export default Home