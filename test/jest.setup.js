/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { stdout, stderr } = require('stdout-stderr')

const eol = require('eol')
const fs = require('fs')
const path = require('path')
const hjson = require('hjson')

// trap console log
beforeEach(() => { stdout.start(); stderr.start(); stdout.print = true })
afterEach(() => { stdout.stop(); stderr.stop() })

process.on('unhandledRejection', error => {
  throw error
})

// dont touch the real fs
jest.mock('fs-extra')
// don't wait for user input in tests
jest.mock('inquirer')
// make sure we mock the app scripts
jest.mock('@adobe/aio-app-scripts')
//
jest.mock('ora')
//
jest.mock('which')
//
jest.mock('execa')

/* global fixtureFile, fixtureJson */

const fixturesFolder = path.join(__dirname, '__fixtures__')

// helper for fixtures
global.fixtureFile = (output) => {
  return fs.readFileSync(`${fixturesFolder}/${output}`).toString()
}

// helper for fixtures
global.fixtureJson = (output) => {
  return JSON.parse(fs.readFileSync(`${fixturesFolder}/${output}`).toString())
}

// helper for fixtures
global.fixtureHjson = (output) => {
  return hjson.parse(fs.readFileSync(`${fixturesFolder}/${output}`).toString())
}

// fixture matcher
expect.extend({
  toMatchFixture (received, argument) {
    const val = fixtureFile(argument)
    // eslint-disable-next-line jest/no-standalone-expect
    expect(eol.auto(received)).toEqual(eol.auto(val))
    return { pass: true }
  }
})

expect.extend({
  toMatchFixtureJson (received, argument) {
    const val = fixtureJson(argument)
    // eslint-disable-next-line jest/no-standalone-expect
    expect(received).toEqual(val)
    return { pass: true }
  }
})

expect.extend({
  toMatchFixtureHjson (received, argument) {
    const val = fixtureHjson(argument)
    // eslint-disable-next-line jest/no-standalone-expect
    expect(received).toEqual(val)
    return { pass: true }
  }
})
