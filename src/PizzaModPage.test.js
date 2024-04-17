import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PizzaModPage from './PizzaModPage';

describe('PizzaModPage', () => {
    test('sends data to correct endpoint on form submission', async () => {
        const fetchMock = jest.fn().mockResolvedValueOnce();

        global.fetch = fetchMock;

        const mockPizza = {
            id: '1',
            name: 'Margarita',
            isGlutenFree: '1',
            kepURL: 'https://example.com/image.jpg'
        };

        render(
            <MemoryRouter initialEntries={['/pizzas/1']}>
                <Routes>
                    <Route path="/pizzas/:pizzaId" element={<PizzaModPage />} />
                </Routes>
            </MemoryRouter>
        );

        await screen.findByText('Pizza módosítása');

        expect(screen.getByLabelText('Pizza név:')).toHaveValue(mockPizza.name);
        expect(screen.getByLabelText('Gluténmentes:')).toHaveValue(mockPizza.isGlutenFree.toString());
        expect(screen.getByLabelText('Kép URL-je:')).toHaveValue(mockPizza.kepURL);

        act(() => {
            fireEvent.change(screen.getByLabelText('Pizza név:'), { target: { value: 'Hawaii' } });
            fireEvent.change(screen.getByLabelText('Gluténmentes:'), { target: { value: '0' } });
            fireEvent.change(screen.getByLabelText('Kép URL-je:'), { target: { value: 'https://example.com/hawaii.jpg' } });
        });

        act(() => {
            fireEvent.click(screen.getByText('Küldés'));
        });

        expect(fetchMock).toHaveBeenCalledWith('https://pizza.kando-dev.eu/Pizza/1', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: '1',
                name: 'Hawaii',
                isGlutenFree: '0',
                kepURL: 'https://example.com/hawaii.jpg'
            })
        });
    });
});
