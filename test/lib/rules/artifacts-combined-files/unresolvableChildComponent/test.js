/* eslint-disable no-undef */
import { LightningElement, wire } from 'lwc';
import { getContacts } from 'lightning/contacts'; // bogus wire import

export default class Example extends LightningElement {
    blah;

    get invalidGetter() {
        this.blah = "I'm not valid" + foo;
        return this.blah;
    }

    @wire(getContacts, {})
    contacts;
}
