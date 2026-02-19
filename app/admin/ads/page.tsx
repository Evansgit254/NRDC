'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Trash2, Eye, MousePointer, Palette, Edit, Copy } from 'lucide-react'

interface Advertisement {
    id: string
    name: string
    type: string
    placement: string
    code: string
    priority: number
    active: boolean
    startDate: string | null
    endDate: string | null
    impressions: number
    clicks: number
}

// Ad template generator
const generateAdCode = (template: string, config: any) => {
    const configWithTemplate = { ...config, template }
    const adContent = {
        gradient_banner: `
            <div style="width: 100%; max-width: ${config.width || '728px'}; height: ${config.height || '90px'}; margin: 0 auto; background: linear-gradient(135deg, ${config.color1 || '#667eea'} 0%, ${config.color2 || '#764ba2'} 100%); background-size: 200% 200%; animation: gradientShift 3s ease infinite; border-radius: 12px; position: relative; font-family: 'Inter', Arial, sans-serif; overflow: hidden; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; box-sizing: border-box; cursor: pointer; box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-2px) scale(1.01)';" onmouseout="this.style.transform='';">
                <div style="position: absolute; top: 4px; right: 4px; background: rgba(255,255,255,0.9); color: #666; font-size: 9px; padding: 2px 5px; border-radius: 3px;">Ad</div>
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="width: 50px; height: 50px; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 24px;">${config.icon || '🎯'}</span>
                    </div>
                    <div>
                        <div style="color: white; font-weight: 700; font-size: 17px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">${config.title || 'Your Ad Title'}</div>
                        <div style="color: rgba(255,255,255,0.95); font-size: 12px;">${config.subtitle || 'Add your description here'}</div>
                    </div>
                </div>
                <div style="background: white; color: ${config.color1 || '#667eea'}; padding: 10px 22px; border-radius: 8px; font-size: 13px; font-weight: 700; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">
                    ${config.buttonText || 'Learn More'} →
                </div>
                <style>@keyframes gradientShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; }}</style>
            </div>
        `,
        product_showcase: `
            <div style="width: ${config.width || '300px'}; height: ${config.height || '250px'}; margin: 0 auto; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 16px; position: relative; font-family: 'Inter', Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; box-sizing: border-box; cursor: pointer; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: all 0.4s ease;" onmouseover="this.style.transform='scale(1.03)';" onmouseout="this.style.transform='';">
                <div style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.5); color: white; font-size: 9px; padding: 3px 6px; border-radius: 4px;">Ad</div>
                <div style="width: 110px; height: 110px; background: white; border-radius: 50%; margin-bottom: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(0,0,0,0.12);">
                    <span style="font-size: 48px;">${config.icon || '🎁'}</span>
                </div>
                <div style="text-align: center;">
                    <div style="color: #333; font-weight: 800; font-size: 20px; margin-bottom: 6px;">${config.title || 'Product Name'}</div>
                    <div style="color: #666; font-size: 13px; margin-bottom: 18px;">${config.subtitle || 'Product description here'}</div>
                    <div style="background: #222; color: white; padding: 11px 28px; border-radius: 25px; font-size: 13px; font-weight: 700; display: inline-block; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                        ${config.buttonText || 'Shop Now'}
                    </div>
                </div>
            </div>
        `,
        popup_card: `
            <div style="width: 100%; max-width: 500px; background: white; border-radius: 20px; overflow: hidden; font-family: 'Inter', sans-serif; box-shadow: 0 20px 50px rgba(0,0,0,0.1);">
                <div style="background: linear-gradient(135deg, ${config.color1 || '#2E8B57'} 0%, ${config.color2 || '#1a5f3a'} 100%); padding: 30px; text-align: center; position: relative;">
                    <div style="width: 80px; height: 80px; background: white; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                        <span style="font-size: 40px;">${config.icon || '📢'}</span>
                    </div>
                    <h3 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">${config.title || 'Attention!'}</h3>
                </div>
                <div style="padding: 30px; text-align: center;">
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                        ${config.subtitle || 'Your message goes here. Make it catchy and engaging for your visitors.'}
                    </p>
                    <div style="background: ${config.color1 || '#2E8B57'}; color: white; padding: 12px 30px; border-radius: 12px; font-weight: 600; display: inline-block; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        ${config.buttonText || 'Learn More'}
                    </div>
                </div>
            </div>
        `
    }

    const content = adContent[template as keyof typeof adContent] || adContent.gradient_banner
    const targetUrl = config.targetUrl || '#'
    const configTag = `<!-- ad-config:${JSON.stringify(configWithTemplate)} -->`

    // Wrap in clickable link
    return `<a href="${targetUrl}" target="_blank" rel="noopener noreferrer" style="display: block; width: 100%; height: 100%; text-decoration: none; cursor: pointer;">${content}</a>${configTag}`
}


export default function AdsPage() {
    const [ads, setAds] = useState<Advertisement[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [editingAd, setEditingAd] = useState<Advertisement | null>(null)

    const [isCreating, setIsCreating] = useState(false)
    const [selectedTemplate, setSelectedTemplate] = useState('gradient_banner')
    const [adConfig, setAdConfig] = useState({
        name: '',
        placement: 'HOME_TOP',
        targetUrl: '#',
        width: '728px',
        height: '90px',
        color1: '#667eea',
        color2: '#764ba2',
        title: 'Premium Service',
        subtitle: 'Get started today with special offer',
        buttonText: 'Learn More',
        icon: '🎯',
        priority: 1,
        active: true
    })

    useEffect(() => {
        fetchAds()
    }, [])

    async function fetchAds() {
        setLoading(true)
        try {
            const res = await fetch('/api/ads/manage')
            if (res.ok) {
                const data = await res.json()
                setAds(data)
            }
        } catch (error) {
            console.error('Error fetching ads:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleSaveAd() {
        const code = generateAdCode(selectedTemplate, adConfig)
        const adData = {
            name: adConfig.name,
            type: 'CUSTOM',
            placement: adConfig.placement,
            code: code,
            priority: adConfig.priority,
            active: adConfig.active,
            startDate: null,
            endDate: null
        }

        try {
            const res = await fetch('/api/ads/manage', {
                method: editingAd ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingAd ? { ...adData, id: editingAd.id } : adData)
            })

            if (res.ok) {
                fetchAds()
                setIsCreating(false)
                setEditingAd(null)
                resetConfig()
            }
        } catch (error) {
            console.error('Error saving ad:', error)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this ad?')) return
        try {
            const res = await fetch(`/api/ads/manage?id=${id}`, { method: 'DELETE' })
            if (res.ok) fetchAds()
        } catch (error) {
            console.error('Error deleting ad:', error)
        }
    }

    function handleEditAd(ad: Advertisement) {
        setEditingAd(ad)
        setIsCreating(true)

        // Try to recover config from hidden comment
        const configMatch = ad.code.match(/<!-- ad-config:(.*?) -->/)
        if (configMatch) {
            try {
                const recoveredConfig = JSON.parse(configMatch[1])
                setSelectedTemplate(recoveredConfig.template || 'gradient_banner')
                setAdConfig(recoveredConfig)
                return
            } catch (e) {
                console.error('Failed to parse recovered config:', e)
            }
        }

        // Fallback for existing "Blogger Recruitment Popup" or other old ads
        const urlMatch = ad.code.match(/href="([^"]*)"/)
        const currentUrl = urlMatch ? urlMatch[1] : adConfig.targetUrl

        // Try to detect template and extract fields via regex fallback
        let detectedTemplate = 'gradient_banner'
        const extractedConfig = { ...adConfig, name: ad.name, placement: ad.placement, targetUrl: currentUrl }

        if (ad.code.includes('Attention!') || ad.code.includes('Looking for Bloggers')) {
            detectedTemplate = 'popup_card'

            // Extract Title
            const titleMatch = ad.code.match(/<h3[^>]*>(.*?)<\/h3>/)
            if (titleMatch) extractedConfig.title = titleMatch[1]

            // Extract Subtitle
            const subtitleMatch = ad.code.match(/<p[^>]*>([\s\S]*?)<\/p>/)
            if (subtitleMatch) extractedConfig.subtitle = subtitleMatch[1].trim()

            // Extract Icon
            const iconMatch = ad.code.match(/<span[^>]*style="[^"]*font-size:\s*40px[^"]*"[^>]*>(.*?)<\/span>/)
            if (iconMatch) extractedConfig.icon = iconMatch[1]

            // Extract Colors from gradient
            const colorMatch = ad.code.match(/linear-gradient\(135deg, (.*?) 0%, (.*?) 100%\)/)
            if (colorMatch) {
                extractedConfig.color1 = colorMatch[1]
                extractedConfig.color2 = colorMatch[2]
            }
        }

        setSelectedTemplate(detectedTemplate)
        setAdConfig(extractedConfig)
    }

    function resetConfig() {
        setAdConfig({
            name: '',
            placement: 'HOME_TOP',
            targetUrl: '#',
            width: '728px',
            height: '90px',
            color1: '#667eea',
            color2: '#764ba2',
            title: 'Premium Service',
            subtitle: 'Get started today',
            buttonText: 'Learn More',
            icon: '🎯',
            priority: 1,
            active: true
        })
    }

    const filteredAds = ads.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.placement.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Visual Ad Builder</h1>
                <button
                    onClick={() => { setIsCreating(true); setEditingAd(null); resetConfig(); }}
                    className="bg-[#6E8C82] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#587068]"
                >
                    <Plus size={20} />
                    Create Visual Ad
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search ads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6E8C82]"
                    />
                </div>
            </div>

            {isCreating && (
                <div className="bg-white p-6 rounded-xl shadow-lg border mb-6">
                    <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                        <Palette /> {editingAd ? 'Edit' : 'Create'} Visual Ad
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Configuration Panel */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Ad Name</label>
                                <input
                                    type="text"
                                    value={adConfig.name}
                                    onChange={(e) => setAdConfig({ ...adConfig, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="e.g., Summer Sale Banner"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Template</label>
                                <select
                                    value={selectedTemplate}
                                    onChange={(e) => {
                                        setSelectedTemplate(e.target.value)
                                        if (e.target.value === 'product_showcase') {
                                            setAdConfig({ ...adConfig, width: '300px', height: '250px' })
                                        } else if (e.target.value === 'popup_card') {
                                            setAdConfig({ ...adConfig, width: '100%', height: 'auto' })
                                        } else {
                                            setAdConfig({ ...adConfig, width: '728px', height: '90px' })
                                        }
                                    }}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="gradient_banner">Gradient Banner (728x90)</option>
                                    <option value="product_showcase">Product Showcase (300x250)</option>
                                    <option value="popup_card">Popup Card (Modal)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Placement</label>
                                <select
                                    value={adConfig.placement}
                                    onChange={(e) => setAdConfig({ ...adConfig, placement: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="HOME_TOP">Home Top</option>
                                    <option value="HOME_BOTTOM">Home Bottom</option>
                                    <option value="BLOG_TOP">Blog Top</option>
                                    <option value="BLOG_BOTTOM">Blog Bottom</option>
                                    <option value="PROGRAMS_TOP">Programs Top</option>
                                    <option value="PROGRAMS_BOTTOM">Programs Bottom</option>
                                    <option value="HOME_POPUP">Home Popup (Overlay)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Target URL (Click Destination)</label>
                                <input
                                    type="url"
                                    value={adConfig.targetUrl}
                                    onChange={(e) => setAdConfig({ ...adConfig, targetUrl: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="https://example.com/your-product"
                                />
                                <p className="text-xs text-gray-500 mt-1">Where users go when they click the ad</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Color 1</label>
                                    <input
                                        type="color"
                                        value={adConfig.color1}
                                        onChange={(e) => setAdConfig({ ...adConfig, color1: e.target.value })}
                                        className="w-full h-10 rounded cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Color 2</label>
                                    <input
                                        type="color"
                                        value={adConfig.color2}
                                        onChange={(e) => setAdConfig({ ...adConfig, color2: e.target.value })}
                                        className="w-full h-10 rounded cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Icon (Emoji)</label>
                                <input
                                    type="text"
                                    value={adConfig.icon}
                                    onChange={(e) => setAdConfig({ ...adConfig, icon: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg text-2xl text-center"
                                    maxLength={2}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    value={adConfig.title}
                                    onChange={(e) => setAdConfig({ ...adConfig, title: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Subtitle</label>
                                <input
                                    type="text"
                                    value={adConfig.subtitle}
                                    onChange={(e) => setAdConfig({ ...adConfig, subtitle: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Button Text</label>
                                <input
                                    type="text"
                                    value={adConfig.buttonText}
                                    onChange={(e) => setAdConfig({ ...adConfig, buttonText: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={adConfig.active}
                                    onChange={(e) => setAdConfig({ ...adConfig, active: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <label className="text-sm font-medium">Active</label>
                            </div>
                        </div>

                        {/* Live Preview */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Live Preview</label>
                            <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 min-h-[300px] flex items-center justify-center">
                                <div dangerouslySetInnerHTML={{ __html: generateAdCode(selectedTemplate, adConfig) }} />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            onClick={() => { setIsCreating(false); setEditingAd(null); }}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveAd}
                            className="px-4 py-2 bg-[#6E8C82] text-white rounded-lg hover:bg-[#587068]"
                        >
                            {editingAd ? 'Update' : 'Save'} Ad
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : filteredAds.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No ads found</div>
                ) : (
                    filteredAds.map((ad) => (
                        <div key={ad.id} className="bg-white p-4 rounded-xl shadow-sm border">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`w-2 h-2 rounded-full ${ad.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                                        <h3 className="font-bold">{ad.name}</h3>
                                        <span className="text-xs bg-[#6E8C82]/10 px-2 py-0.5 rounded">{ad.placement}</span>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded border">
                                        <div dangerouslySetInnerHTML={{ __html: ad.code }} />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="text-center px-3 py-1 bg-gray-50 rounded">
                                        <div className="text-xs text-gray-500">Views</div>
                                        <div className="font-bold">{ad.impressions}</div>
                                    </div>
                                    <div className="text-center px-3 py-1 bg-gray-50 rounded">
                                        <div className="text-xs text-gray-500">Clicks</div>
                                        <div className="font-bold">{ad.clicks}</div>
                                    </div>
                                    <button
                                        onClick={() => handleEditAd(ad)}
                                        className="p-2 text-[#6E8C82] hover:bg-[#6E8C82]/10 rounded"
                                        title="Edit"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(ad.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
