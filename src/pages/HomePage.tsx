import React from 'react';
import { Button } from '@blueprintjs/core';

export const HomePage = () => {
  return (
    <div>
      <div className="relative homePageBackground cover">
        <div className="flex w-100 justify-end">
          <Button className="mr4-l mt4-l mr5-m mt5-m mt2 mr2 outline-0" style={{ background: '#060517', color: 'white', fontSize: '1rem' }}>Login</Button>
        </div>
        <div className="cf flex-ns">
          <div className="w-100 w-50-ns dt vh-100-ns">
            <div className="v-mid dtc">
              <div className="w-70 center">
                <img className="w-34-ns w-30 mb4-l mb3-m" src={require('./../resources/images/homeLogo.png')} />
                <h1 className="tj white mb5-l mb4-m f4-ns f7 mv3">
                  Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy text
                ever since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book. It has survived not
                </h1>
                <Button className="grow pointer"
                  style={{ outline: "none", color: "white", background: '#0fa3a3', borderRadius: '26px', width: '132px', height: '41px' }}
                  onClick={(e: any) => {
                    e.preventDefault();
                  }}
                >
                  Sign In
              </Button>
                <Button className="grow pointer ml3-l ml1"
                  style={{ outline: "none", color: "white", background: '#060517', border: '1px solid #fff', borderRadius: '26px', width: '132px', height: '41px' }}
                  onClick={(e: any) => {
                    e.preventDefault();
                  }}
                >
                  Watch Demo
              </Button>
                <p className="pointer white mt5-l mt4-m f4-ns mt1 mv3">Don't have an account?</p>
              </div>
            </div>
          </div>
          <div className="w-100 w-50-ns dt vh-100-ns">
            <div className="v-mid dtc">
              <div className="center w-100-ns w-70 mv2">
                <img className="" src={require('./../resources/images/homeSS.png')} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-ns justify-around ph5-ns pv7-l pv6-m">
        <div className="tc cf mh3-ns w-25-ns w-100 ph4">
          <img src={require('./../resources/images/homeSS3.png')} />
          <h1 className="f5">Room</h1>
          <p className="tj">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magni tempora unde molestias corporis possimus illum ducimus quisquam iusto pariatur labore quibusdam debitis atque nostrum laborum dicta, ullam quo esse rem!</p>
        </div>
        <div className="tc cf mh3-ns w-25-ns w-100 ph4">
          <img src={require('./../resources/images/homeSS3.png')} />
          <h1 className="f5">Task</h1>
          <p className="tj">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora eum cumque laborum eaque iusto ea, quod autem hic perferendis modi facere magnam suscipit architecto pariatur veritatis aut adipisci ex? Consequatur.</p>
        </div>
        <div className="tc cf mh3-ns w-25-ns w-100 ph4">
          <img src={require('./../resources/images/homeSS3.png')} />
          <h1 className="f5">Expo</h1>
          <p className="tj">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel accusamus nam culpa. Consequatur officiis quasi beatae quo dolore, tenetur asperiores.</p>
        </div>
        <div className="tc cf mh3-ns w-25-ns w-100 ph4">
          <img src={require('./../resources/images/homeSS3.png')} />
          <h1 className="f5">Feed</h1>
          <p className="tj">Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, ut.</p>
        </div>
      </div>
      <div className="cf flex-ns pv6-ns pv4" style={{ backgroundColor: '#060517' }}>
        <div className="w-100 w-50-ns dt">
          <div className="w-80 center-ns flex justify-around">
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