/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';


console.log = () => null;
console.warn = () => null;
console.error = () => null;
// alert = () => null;


AppRegistry.registerComponent(appName, () => App);
