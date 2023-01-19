import React, { useContext } from 'react';
import { useLoaderData } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthProvider/AuthProvider';

const Checkout = () => {
    const serviceDetails = useLoaderData();
    const { _id, title, price } = serviceDetails
    const { user } = useContext(AuthContext);

    const placeOrder = event => {
        event.preventDefault();
        const form = event.target;
        const name = `${form.firstName.value} ${form.lastName.value}`;
        const email = user?.email || 'unregistered';
        const phone = form.phone.value
        const message = form.message.value;

        const order = {
            service: _id,
            serviceName: title,
            price: price,
            customer: name,
            email,
            phone,
            message
        }

        if (phone.length !== 11) {
            alert("Please enter a 11 digit phone number")
        }
        else {
            fetch("http://localhost:5000/orders", {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(order)
            })

                .then(res => res.json())
                .then(data => {
                    console.log(data)

                    if (data.acknowledged) {
                        alert("Order Placed Successfully")
                        form.reset();
                    }
                    else {
                        alert("Order Could not placed,try again")
                    }
                })
                .catch(err => console.error(err))
        }
    }
    return (
        <div>
            <form onSubmit={placeOrder}>
                <h2 className="text-4xl">{title}</h2>
                <h4 className='text-3xl'> {price}$</h4>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                    <input name='firstName' type="text" placeholder="First Name" className="input input-bordered input-ghost w-full" />
                    <input name='lastName' type="text" placeholder="Last Name" className="input input-bordered input-ghost w-full" />
                    <input name='phone' type="text" placeholder="Your Phone" className="input input-bordered input-ghost w-full" required />
                    <input name='email' type="text" placeholder="Your Mail" className="input input-bordered input-ghost w-full" defaultValue={user?.email} readOnly />
                </div>
                <textarea name='message' className='textarea textarea-bordered h-24 w-full' placeholder='Any Message'></textarea>

                <input className='btn' type="submit" value='Place your order' />
            </form>


        </div>
    );
};

export default Checkout;