import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from './page';

beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                properties: {
                    gridX: 50,
                    gridY: 50,
                    periods: [{
                        temperature: 70,
                        temperatureUnit: 'F',
                        detailedForecast: 'Sunny',
                        icon: 'http://example.com/icon.png',
                        startTime: new Date().toISOString()
                    }]
                }
            })
        }) as Promise<Response>
    );
});

test('renders the form and handles the form submission', async () => {
    render(<Home />);
    fireEvent.change(screen.getByRole('textbox', {name: /address/i}), { target: { value: '123 Main St' } });
    fireEvent.click(screen.getByRole('button', {name: /get forecast/i}));

    await waitFor(() => expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument());
    expect(screen.getByText(/sunny/i)).toBeInTheDocument();
});

test('displays an error message when geocoding fails', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
            ok: false,
            status: 500,
            json: () => Promise.resolve({ message: 'Geocoding failed' })
        })
    );

    render(<Home />);
    fireEvent.change(screen.getByRole('textbox', {name: /address/i}), { target: { value: '123 Main St' } });
    fireEvent.click(screen.getByRole('button', {name: /get forecast/i}));

    await waitFor(() => expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument());
    expect(screen.getByText(/error: geocoding failed/i)).toBeInTheDocument();
});

test('displays an error message when weather API fails', async () => {
    (global.fetch as jest.Mock)
        .mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })) // Mock geocoding success
        .mockImplementationOnce(() => Promise.resolve({ ok: false, json: () => Promise.resolve({ message: 'Weather fetching failed' }) })); // Mock weather failure

    render(<Home />);
    fireEvent.change(screen.getByRole('textbox', {name: /address/i}), { target: { value: '123 Main St' } });
    fireEvent.click(screen.getByRole('button', {name: /get forecast/i}));

    await waitFor(() => expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument());
    expect(screen.getByText(/error: weather fetching failed/i)).toBeInTheDocument();
});

test('updates input field correctly', () => {
    render(<Home />);
    const input: HTMLInputElement = screen.getByRole('textbox', {name: /address/i});
    fireEvent.change(input, { target: { value: '123 Main St' } });
    expect(input.value).toBe('123 Main St');
});
