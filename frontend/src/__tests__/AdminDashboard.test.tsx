import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import AdminDashboard from '../pages/AdminDashboard';
import { campaignsAPI } from '../services/api';

vi.mock('../services/api');
const mockCampaigns = vi.mocked(campaignsAPI);

describe('AdminDashboard QR downloads', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCampaigns.getAll.mockResolvedValue({ data: [{ id: 'c1', name: 'Campanha A' }] } as any);
  });

  afterEach(() => {
    // restore any overrides
    if ((globalThis as any).originalCreateElement) {
      document.createElement = (globalThis as any).originalCreateElement;
      (globalThis as any).originalCreateElement = undefined;
    }
    if ((globalThis as any).originalImage) {
      (globalThis as any).Image = (globalThis as any).originalImage;
      (globalThis as any).originalImage = undefined;
    }
    if ((globalThis as any).originalCreateObjectURL) {
      URL.createObjectURL = (globalThis as any).originalCreateObjectURL;
      (globalThis as any).originalCreateObjectURL = undefined;
    }
  });

  it('opens QR modal and downloads SVG and PNG', async () => {
    render(<AdminDashboard />);

    // Wait for the table row to appear
    const qrButton = await screen.findByRole('button', { name: /QR Code/i });
    fireEvent.click(qrButton);

    // Wait for modal dialog
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // Prepare to intercept downloads
    const originalCreateElement = document.createElement;
    (globalThis as any).originalCreateElement = originalCreateElement;
    let anchorClicks: Array<{ href: string; download: string }> = [];
    document.createElement = ((tagName: string) => {
      if (tagName === 'a') {
        const a: any = originalCreateElement.call(document, 'a');
        a.click = () => {
          anchorClicks.push({ href: a.href, download: a.download });
        };
        return a as HTMLAnchorElement;
      }
      if (tagName === 'canvas') {
        const c: any = originalCreateElement.call(document, 'canvas');
        c.getContext = () => ({
          fillRect: () => {},
          drawImage: () => {},
          toDataURL: () => 'data:image/png;base64,FAKEPNG',
        });
        return c;
      }
      return originalCreateElement.call(document, tagName);
    }) as any;

    // Mock URL.createObjectURL
    (globalThis as any).originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = (_blob: any) => 'blob://fake';

    // Mock Image to auto-trigger onload
    const originalImage = (globalThis as any).Image;
    (globalThis as any).originalImage = originalImage;
    class FakeImage {
      onload: any = null;
      onerror: any = null;
      width = 160;
      height = 160;
      set src(_s: string) {
        setTimeout(() => {
          this.onload && this.onload();
        }, 0);
      }
    }
    (globalThis as any).Image = FakeImage as any;

    // Click 'Baixar SVG'
    // There are two buttons; try both 'Baixar SVG' specifically
    const svgBtn = within(dialog).getByText('Baixar SVG');
    fireEvent.click(svgBtn);
    await waitFor(() => expect(anchorClicks.length).toBeGreaterThanOrEqual(1));
    expect(anchorClicks[0].download).toMatch(/Campanha_A/);

    // Click 'Baixar PNG'
    const pngBtn = within(dialog).getByRole('button', { name: /Baixar PNG/i });
    fireEvent.click(pngBtn);
    await waitFor(() => expect(anchorClicks.length).toBeGreaterThanOrEqual(2));
    expect(anchorClicks[1].download).toMatch(/Campanha_A/);
  });
});
