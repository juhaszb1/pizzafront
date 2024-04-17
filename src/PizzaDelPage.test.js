import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PizzaDelPage from './PizzaDelPage';

describe('PizzaDelPage', () => {
    test('sends DELETE request to correct endpoint on form submission', async () => {
        const fetchMock = jest.fn().mockResolvedValueOnce();

        global.fetch = fetchMock;

        const mockPizza = {
            id: '1',
            name: 'Margarita',
            isGlutenFree: 1,
            kepURL: 'https://example.com/image.jpg'
        };

        render(
            <MemoryRouter initialEntries={['/pizzas/1']}>
                <Routes>
                    <Route path="/pizzas/:pizzaId" element={<PizzaDelPage />} />
                </Routes>
            </MemoryRouter>
        );

        await screen.findByText(`Törlendő elem: ${mockPizza.name}`);

        fireEvent.click(screen.getByText('Törlés'));

        expect(fetchMock).toHaveBeenCalledWith(`https://pizza.kando-dev.eu/Pizza/${mockPizza.id}`, {
            method: 'DELETE'
        });

    });
});
