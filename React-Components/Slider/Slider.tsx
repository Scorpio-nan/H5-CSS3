import React, { useState, useRef } from 'react';
import { throttle } from '../../utils';
import './slide.scss';
import 'default-passive-events';
import { useStateRef } from '../../utils/useStateRef';

export interface Iprops {
    children?: Array<any>, 
    style?: Record<string, any>,
    navigation?: boolean,
    activeClass?: string,
    duration?: number,
    transverse?: boolean,
    navImage?: Array<any>,
    arrowNav?: boolean,
    pageCount?: number,
    isScrolling?: boolean,
    client?: { height: number, width: number },
    [key:string]: any
}

export default function Slider (props: Iprops) {
    /**
     * 是否在滑动
     */
    const [isScrolling, setScrolling, isScrollingRef] = useStateRef<boolean>(false);
    /**
     * 页面数量
     */
    const [pageCount, setPageCount, pageCountRef] = useStateRef<number>(0);
    /**
     * 当前页面
     */
    const [currentPage, setCurrentPage, currentPageRef] = useStateRef<number>(0);
    /**
     * 页面尺寸
     */
    const [client, setClient] = useState<{ height: number, width: number }>({ height: 0, width: 0 });
    /**
     * 纵向滚动时候, 距离上面的距离
     */
    const [offset, setOffset] = useState<number>(0);
    /**
     * activeClass, 当前激活的样式
     */
    const [activeClass, setActiveClass] = useState<string>('active');
    /**
     * duration 翻页需要的时间
     */
    const [duration, setDuration] = useState<number>(1000);
    /**
     * navigation 是否开启导航点,默认为true
     */
    const [navigation, setNavigation] = useState<boolean>(true);
    /**
     * transverse 横向还是竖向滚动, true 为横向, false 为竖向
     */
    const [transverse, setTransverse] = useState<boolean>(false);
    /**
     * navImage
     */
    const [navImage, setNavImage] = useState<Array<any>>([]);
    /**
     * arrowNav 是否开启导航箭头
     */
    const [arrowNav, setArrowNav] = useState<boolean>(false);


    const container = useRef<HTMLDivElement>(null);

    /**
     * 初始化样式
     * @returns 
     */
    function getContainerStyles(): Record<string, any> {
        return transverse ? {
            transform: `translate3d(${-currentPage * client.width}px,0px,0px)`,
            transition: `all ${duration}ms ease`,
            display: 'flex',
            flex: 1,
            width: pageCount * client.width + 'px'
        } : {
            transform: `translate3d(0px,${-currentPage * client.height}px,0px)`,
            transition: `all ${duration}ms ease`
        }
    }
    
    /**
     * 导航器的点击事件
     * @param index 
     */
    function handleNavClick(index:number) {
        setCurrentPage(index)
    }


    /**
     * 箭头的点击事件
     * @param n 
     */
    function handleArrowClick(n:number) {
        scroll(n);
    }

    /**
     * 初始化
     */
    function init () {
        setClient(props.client || {
            width: window.innerWidth,
            height: window.innerHeight
        })

        setNavigation(props.navigation || true);
        setActiveClass(props.activeClass || 'active');
        setDuration(props.duration || 1000);
        setTransverse(props.transverse || false);
        setNavImage(props.navImage || []);
        setArrowNav(props.arrowNav || false);
        setPageCount(props.pageCount || props.children?.length as number);
    }

    /**
     * 网页 resize
     */
    function resize () {
        setClient({
            width: window.innerWidth,
            height: window.innerHeight
        })
    }

    /**
     * 滚动到
     * @param n 
     */
    function scroll(n:number) {

        setScrolling(true);

        setCurrentPage((prevcCurrent) => {
            return prevcCurrent + n;
        });

        setTimeout(() => {
            setScrolling(false);
        }, duration);
    }
 
    /**
     * 翻页的逻辑
     * @param e 
     */
    function mouseScroll(e:any){

        const doc = document;
        const t = doc.documentElement.scrollTop || doc.body.scrollTop;

        if (t >= offset) {

            if (currentPage !== 0) return e.preventDefault();
            
            if (t + 20 >= offset) {
                setNavigation(props.navigation || true);
                setArrowNav(props.arrowNav || false);
            }

            if (isScrollingRef.current) return false;

            if (e.wheelDelta < 0 || e.detail > 0) {
                if (currentPageRef.current >= pageCountRef.current - 1) {
                    return false;
                }
                scroll(1)
            } else if (e.wheelDelta > 0 || e.detail < 0) {
                if (currentPageRef.current <= 0) {
                    return false;
                }
                scroll(-1)
            } else {
                return false
            }

        } else {
            setNavigation(false);
            setArrowNav(false);
        }
    }


    React.useEffect(() => {

        init();
        window.addEventListener('resize', throttle(resize, 100, true), false);

        if (!props.isScrolling) {
            container.current?.addEventListener('DOMMouseScroll', mouseScroll, false);
            container.current?.addEventListener('mousewheel', mouseScroll, false);
        }  else  {
            container.current?.removeEventListener('DOMMouseScroll', mouseScroll, false);
            container.current?.removeEventListener('mousewheel', mouseScroll, false);
        }
    }, [ ])

    React.useEffect(() => {
        if (!offset || offset !== container.current?.offsetTop) {
            setOffset(container.current?.offsetTop as number);
            // setNavigation(false);
            // setArrowNav(false);
        }
    }, [offset, container.current?.offsetTop, currentPage])

    return (
        <div ref={ container } className="full-wrap" style={{ width: client.width, height: client.height, ...props?.style }}>
            <div className='full-container' style={getContainerStyles()}>
                {props?.children}
            </div>
            {
                navigation && (
                    <div className={`slip-navigation ${transverse ? 'horizontal' : 'vertical'}`}>
                        {
                            props.children?.map((item:any, index:number) => {
                                const active = index === currentPage ? activeClass : '';
                                return (
                                    <div
                                        key={index}
                                        className={`${active} navigation-dot`}
                                        onClick={() => handleNavClick(index)}
                                    >
                                        {navImage && navImage.length > 0 && <img src={navImage[index]} alt=""/>}
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
            {
                arrowNav && (
                    <div className='slip-arrow'>
                        {
                            currentPage > 0 && (
                            <div
                                className={`arrow-last arrow ${transverse ? 'left' : 'top'}`}
                                onClick={() => handleArrowClick(-1)}>
                            </div>
                            )
                        }
                        {
                            currentPage < pageCount - 1 && (
                            <div
                                className={`arrow-next arrow ${transverse ? 'right' : 'bottom'}`}
                                onClick={() => handleArrowClick(1)}>
                            </div>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}


export const SliderFC: React.FC<{message:string}> = (props) => {

    const [count, setCount] = useState(0)

    return (
        <div>
            { props.message }
        </div>
    )
}



function App (props:Iprops) {

    const { name } = props;

    return (
        <div className='App'>
            <h1>hello world</h1>
            <h2>{name}</h2>
        </div>
    )
}



