import { render, screen } from '@testing-library/react'
import Home from '../pages/index'

// Mock Solana wallet adapter
jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: () => ({
    publicKey: null,
    connected: false,
    disconnect: jest.fn(),
  }),
  useConnection: () => ({
    connection: {
      requestAirdrop: jest.fn(),
      confirmTransaction: jest.fn(),
      getGenesisHash: jest.fn().mockResolvedValue('EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG'),
    },
  }),
  WalletAdapterNetwork: {
    Devnet: 'devnet',
  },
}))

// Mock the x402 components
jest.mock('@solana-x402/connect', () => ({
  PaymentButton: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="payment-button">{children}</button>
  ),
  PaymentForm: () => <div data-testid="payment-form">Payment Form</div>,
  BalanceDisplay: () => <div data-testid="balance-display">Balance Display</div>,
  USDC_MINT: {
    Devnet: 'mock-usdc-mint',
  },
  DEFAULT_TOKEN_INFO: {
    symbol: 'USDC',
    decimals: 6,
    name: 'USD Coin',
  },
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Zap: () => <div data-testid="zap-icon" />,
  KeyRound: () => <div data-testid="keyround-icon" />,
  Bot: () => <div data-testid="bot-icon" />,
  ArrowRight: () => <div data-testid="arrowright-icon" />,
  Wallet: () => <div data-testid="wallet-icon" />,
  Send: () => <div data-testid="send-icon" />,
  Droplet: () => <div data-testid="droplet-icon" />,
  Coins: () => <div data-testid="coins-icon" />,
  AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
  LogOut: () => <div data-testid="logout-icon" />,
  Info: () => <div data-testid="info-icon" />,
}))

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />)
    expect(screen.getByText('Instant Micropayments')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<Home />)
    expect(
      screen.getByText(/Accept USDC payments on Solana using the x402 protocol/i)
    ).toBeInTheDocument()
  })

  it('renders the balance display section', () => {
    render(<Home />)
    expect(screen.getByText('Your Balance')).toBeInTheDocument()
    expect(screen.getByTestId('balance-display')).toBeInTheDocument()
  })

  it('renders the quick payment section', () => {
    render(<Home />)
    expect(screen.getByText('Quick Payment')).toBeInTheDocument()
    expect(screen.getByTestId('payment-button')).toBeInTheDocument()
    expect(screen.getByText('Pay 0.01 USDC')).toBeInTheDocument()
  })

  it('renders the custom payment section', () => {
    render(<Home />)
    expect(screen.getByText('Custom Payment')).toBeInTheDocument()
    expect(screen.getByTestId('payment-form')).toBeInTheDocument()
  })

  it('renders the features section', () => {
    render(<Home />)
    expect(screen.getByText('Why Choose x402?')).toBeInTheDocument()
    expect(screen.getByText('Instant Payments')).toBeInTheDocument()
    expect(screen.getByText('No API Keys')).toBeInTheDocument()
    expect(screen.getByText('AI Agent Ready')).toBeInTheDocument()
  })

  it('renders feature descriptions', () => {
    render(<Home />)
    expect(
      screen.getByText(/Process micropayments in under a second/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/x402 protocol requires no accounts, API keys/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/AI agents can discover and pay for resources automatically/i)
    ).toBeInTheDocument()
  })

  it('renders the footer', () => {
    render(<Home />)
    expect(
      screen.getByText(/Built with x402 Solana Connect • Devnet Environment/i)
    ).toBeInTheDocument()
  })

  it('renders all feature icons', () => {
    render(<Home />)
    expect(screen.getAllByTestId('zap-icon').length).toBeGreaterThan(0)
    expect(screen.getByTestId('keyround-icon')).toBeInTheDocument()
    expect(screen.getByTestId('bot-icon')).toBeInTheDocument()
    expect(screen.getByTestId('wallet-icon')).toBeInTheDocument()
    expect(screen.getByTestId('send-icon')).toBeInTheDocument()
    expect(screen.getByTestId('arrowright-icon')).toBeInTheDocument()
  })

  it('does not render payment result initially', () => {
    render(<Home />)
    expect(screen.queryByText('Payment Successful!')).not.toBeInTheDocument()
  })

  it('has correct section structure', () => {
    const { container } = render(<Home />)

    // Check for header
    const header = container.querySelector('header')
    expect(header).toBeInTheDocument()

    // Check for main
    const main = container.querySelector('main')
    expect(main).toBeInTheDocument()

    // Check for footer
    const footer = container.querySelector('footer')
    expect(footer).toBeInTheDocument()
  })

  it('renders card components', () => {
    const { container } = render(<Home />)

    // Should have multiple cards
    const cards = container.querySelectorAll('[class*="rounded-lg"][class*="border"]')
    expect(cards.length).toBeGreaterThan(3) // Balance, Quick Payment, Custom Payment, and feature cards
  })
})
