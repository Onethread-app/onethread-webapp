import React from 'react'
import { Icon, Button, EditableText, H5, ProgressBar, Checkbox, Popover, FileInput, TextArea } from '@blueprintjs/core'
import { AddTeamMemberForm } from './AddTeamMemberForm'
import { DateInput } from '@blueprintjs/datetime'

export const TaskDetails = () => {
  return (
    <div className="pa4 overflow-y-auto" style={{ height: '75vh' }}>
      <div className="cf">
        <div className="dib">
          <H5>
            <EditableText value="Bug Fix" />
          </H5>
        </div>
        <div className="fr">
          <Button
            className="bp3-minimal outline-0 grow"
            style={{ backgroundColor: "#0fa3a3" }}
          >
            <Icon
              className="bg-tigrowLightBlue"
              icon="notifications"
              style={{ color: "white" }}
            />
          </Button>
        </div>
      </div>
      <div className="flex justify-between mt4">
        <div>
          <h1 className="f6">Description</h1>
          <EditableText multiline={true} minLines={2} value="AWS registration. we want to integrate into cloud aws." />
          <div className="mt2">
            <h1 className="f6">Assigned to</h1>
            <div className="pa1 dib">
              <img
                src="http://tachyons.io/img/logo.jpg"
                className="br2 h2 w2" alt="avatar" />
            </div>
            <div className="pa1 dib">
              <img
                src="http://tachyons.io/img/logo.jpg"
                className="br2 h2 w2" alt="avatar" />
            </div>
          </div>
        </div>
        <div>
          <div>
            <Popover
              content={
                <div className="pa3 cf bg-white">
                  <h1 className="f5">Attach Files</h1>
                  <FileInput text="Choose file..." />
                  <div>
                    <Button
                      type="submit"
                      text="Attach"
                      className="grow h2 pointer w-40 fr mt2"
                      style={{ background: "#0fa3a3", outline: "none", color: 'white', boxShadow: 'none' }}
                    />
                  </div>
                </div>
              }
              target={
                <Button
                  className="outline-0 bp3-minimal grow mb2"
                  text="Attach Files"
                  icon="document"
                  style={{ backgroundColor: "#F2FAFA" }}
                />
              }
            />
          </div>
          <div >
            <Popover
              content={<AddTeamMemberForm />}
              target={
                <Button
                  className="outline-0 bp3-minimal grow mb2"
                  text="Members"
                  icon="people"
                  style={{ backgroundColor: "#F2FAFA" }}
                />
              }
            />
          </div>
        </div>
      </div>
      <div className="mt3 dt">
        <h1 className="f6">Attach Files</h1>
        <p
          className="pa2 br3"
          style={{ backgroundColor: "#F2FAFA" }}
        >
          company.tsx
        </p>
      </div>
      <div className="mt2 dt">
        <h1 className="f6">Due Date</h1>
        <DateInput
          formatDate={date => date.toLocaleDateString()}
          parseDate={str => new Date(str)}
          placeholder={"M/D/YYYY"}
        />
      </div>
      <div className="mt3">
        <div className="flex">
          <h1 className="f6 flex-auto">SubTask</h1>
          <h1 className="f6 blue">33%</h1>
        </div>
        <ProgressBar
          stripes={false}
          intent="primary"
          value={.5}
        />
        <div className="mt3 mb3">
          <Checkbox label="Long established fact that a reader will be distracted when looking at its layout." />
          <Checkbox label="Long established fact that a reader will be distracted when looking at its layout." />
        </div>
        <TextArea
          className="w-100 h-auto"
          style={{ resize: 'none' }}
          growVertically={true}
          placeholder="add a subtask"
        />
        <div className="mt3">
          <Button
            type="submit"
            text="Add SubTask"
            className="grow h2 pointer w-15 dib"
            style={{ background: "#0fa3a3", outline: "none", color: 'white', borderRadius: '0px', boxShadow: 'none' }}
          />
          <h1 className="f6 blue fr dim pointer">Cancel</h1>
        </div>
      </div>
      <div className="mt4">
        <h1 className="f5 fw6 lh-title black">Activity</h1>
        <div className="pa2">
          <article className="dt pb2 mt2 w-100">
            <div className="dtc w2 v-mid">
              <img src="http://mrmrs.github.io/photos/p/2.jpg" className="ba b--black-10 db br-100 w2 h2" />
            </div>
            <div className="dtc v-mid pl3">
              <TextArea
                className="w-80"
                style={{ resize: 'none', boxShadow: 'none', backgroundColor: '#F2FAFA', height: 'auto' }}
                growVertically={true}
                placeholder="Write a comment..."
              />
            </div>
          </article>
          <article className="dt pb2 mt2">
            <div className="dtc w2">
              <img src="http://mrmrs.github.io/photos/p/2.jpg" className="ba b--black-10 db br-100 w2 h2" />
            </div>
            <div className="dtc v-mid pl3">
              <h1 className="f6 fw6 lh-title black mv0">Md Saiful Islam </h1>
              <p className="pa2 br3 mt2" style={{ backgroundColor: "#F2FAFA" }}>It is a long established fact that a reader will be distracted by the readable</p>
            </div>
          </article>
          <article className="dt pb2 mt2">
            <div className="dtc w2">
              <img src="http://mrmrs.github.io/photos/p/2.jpg" className="ba b--black-10 db br-100 w2 h2" />
            </div>
            <div className="dtc v-mid pl3">
              <h1 className="f6 fw6 lh-title black mv0">Md Saiful Islam </h1>
              <p className="pa2 br3 mt2" style={{ backgroundColor: "#F2FAFA" }}>It is a long established fact that a reader will be distracted by the readable</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}