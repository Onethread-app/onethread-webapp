import React from 'react';
import { Button } from '@blueprintjs/core';

export const HomePage = () => {
  return (
    <div>
      <div className="relative homePageBackground cover" style={{}}>
        <div className="flex w-100 justify-end">
          <Button className="mr4-ns mt4-ns outline-0" style={{ background: '#060517', color: 'white', fontSize: '1rem' }}>Login</Button>
        </div>
        <div className="cf flex-ns">
          <div className="w-100 w-50-ns dt vh-100">
            <div className="v-mid dtc">
              <div className="w-70 center">
                <img className="w-34" src={require('./../resources/images/homeLogo.png')} />
                <h3 className="tj white">
                  Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy text
                ever since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book. It has survived not
                </h3>
                <Button className="w4 grow h2 pointer"
                  style={{ outline: "none", color: "white", background: '#0fa3a3', borderRadius: '15px' }}
                  onClick={(e: any) => {
                    e.preventDefault();
                  }}
                >
                  Sign In
              </Button>
                <Button className="w4 grow h2 pointer ml3"
                  style={{ outline: "none", color: "white", background: '#060517', border: '1px solid #fff', borderRadius: '15px' }}
                  onClick={(e: any) => {
                    e.preventDefault();
                  }}
                >
                  Watch Demo
              </Button>
                <p className="pointer white mt4">Don't have an account?</p>
              </div>
            </div>
          </div>
          <div className="w-100 w-50-ns dt vh-100">
            <div className="v-mid dtc">
              <div className="center w-100">
                <img className="" src={require('./../resources/images/homeSS.png')} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-around ph5-ns pv6-ns">
        <div className="tc cf mh2 w-25-ns">
          <img src={require('./../resources/images/homeSS3.png')} />
          <h1 className="f5">Room</h1>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magni tempora unde molestias corporis possimus illum ducimus quisquam iusto pariatur labore quibusdam debitis atque nostrum laborum dicta, ullam quo esse rem!</p>
        </div>
        <div className="tc cf mh2 w-25-ns">
          <img src={require('./../resources/images/homeSS3.png')} />
          <h1 className="f5">Task</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora eum cumque laborum eaque iusto ea, quod autem hic perferendis modi facere magnam suscipit architecto pariatur veritatis aut adipisci ex? Consequatur.</p>
        </div>
        <div className="tc cf mh2 w-25-ns">
          <img src={require('./../resources/images/homeSS3.png')} />
          <h1 className="f5">Expo</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, ut.</p>
        </div>
        <div className="tc cf mh2 w-25-ns">
          <img src={require('./../resources/images/homeSS3.png')} />
          <h1 className="f5">Feed</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, ut.</p>
        </div>
      </div>
      <div className="cf flex-ns" style={{ backgroundColor: '#060517' }}>
        <div className="w-100 w-50-ns dt">
          <div className="w-80 center flex justify-around">
            <div>
              <h1 className="f5 silver mv3">Company</h1>
              <h1 className="f5 silver mv3">Team</h1>
              <h1 className="f5 silver mv3">Product</h1>
              <h1 className="f5 silver mv3">Contact</h1>
            </div>
            <div>
              <h1 className="f5 silver mv3">Privacy</h1>
              <h1 className="f5 silver mv3">Blog</h1>
              <h1 className="f5 silver mv3">Docs</h1>
              <h1 className="f5 silver mv3">Press</h1>
            </div>
          </div>
        </div>
        <div className="w-100 w-50-ns dt">
          <div className="w-80 center">
            <div >
              <h1 className="f5 white">Address</h1>
              <p className="silver">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus consectetur impedit exercitationem nostrum blanditiis molestiae, quis sunt et harum rerum?</p>
            </div>
            <div>
              <h1 className="f5 white">Contact Information</h1>
              <p className="silver">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus consectetur impedit exercitationem nostrum blanditiis molestiae, quis sunt et harum rerum?</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}