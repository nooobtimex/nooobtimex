import React from 'react'
import CopyButton from '@/components/contact/CopyButton'
import CyberQR from '@/components/contact/CyberQR'
import CyberIcon from '@/components/cyber/CyberIcon'
import NeonPanel from '@/components/cyber/NeonPanel'
import type { ContactChannel } from '@/common'

interface WeChatPanelProps {
	channel: ContactChannel
}

/**
 * WeChat gets its own panel because it is the only channel that works inside mainland
 * China, and because Tencent publishes no add-me link — a scan is the whole mechanism.
 *
 * The WeChat ID renders as copyable text beneath the code on purpose. A personal WeChat
 * QR has no expiry timer, but tapping "Reset QR Code" kills the token with no error
 * surface (a dead link just redirects to wechat.com). The ID keeps the manual
 * search-by-ID path alive, turning a total failure into a minor one.
 */
const WeChatPanel: React.FC<WeChatPanelProps> = ({ channel }) => {
	if (!channel.qr) return null

	return (
		<NeonPanel variant='yellow' corners className='flex flex-col items-center gap-5 p-6 text-center'>
			<div>
				<h3 className='font-display flex items-center justify-center gap-2 text-2xl font-bold tracking-wide'>
					<CyberIcon icon={channel.icon} className='text-cyber-green size-6' />
					WeChat
				</h3>
				<p className='text-muted-foreground mt-1 text-sm'>{channel.note}</p>
			</div>

			<CyberQR value={channel.qr} title='WeChat QR — scan in WeChat to add me as a friend' size={200} />

			<p className='text-cyber-yellow font-mono text-xs tracking-[0.3em] uppercase'>Scan with WeChat</p>

			{channel.value && (
				<div className='border-border flex w-full items-center justify-center gap-2 border-t pt-4'>
					<span className='text-muted-foreground font-mono text-xs tracking-wider uppercase'>ID</span>
					<span className='font-mono text-sm'>{channel.value}</span>
					<CopyButton value={channel.value} label='Copy WeChat ID' />
				</div>
			)}

			{channel.verifiedOn && (
				<p className='text-muted-foreground font-mono text-[0.65rem] tracking-widest uppercase'>
					QR verified {channel.verifiedOn}
				</p>
			)}
		</NeonPanel>
	)
}

export default WeChatPanel
