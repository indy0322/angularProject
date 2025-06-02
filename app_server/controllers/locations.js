const { response } = require('express')
const request = require('request')

const apiOptions = {server: 'http://localhost:3000'}

if(process.env.NODE_ENV == 'production'){
    apiOptions.server = 'https://kimseungmin.onrender.com'
    console.log("production status")
    //apiOptions.server = 'https://loc8r-data-147ca6428ac3.herokuapp.com'
}else{
    console.log("develop status")
}

/*const path = '/api/locations'

const requestOption = {
    url: apiOption + '/api/path',
    method: 'GET',
    json: {},
    qs: {
        offset: 20
    }
}

request(requestOption, (err, response, body) => {
    if(err){
        console.log(err)
    }else if(response.statusCode === 200){
        console.log(body)
    }else{
        console.log(response.statusCode)
    }
})*/

const formatDistance = (distance) => {
    let thisDistance = 0
    let unit = 'm'
    if(distance > 1000){
        thisDistance = parseFloat(distance/1000).toFixed(1)
        unit = 'km'
    }else{
        thisDistance = Math.floor(distance)
    }
    return thisDistance + unit
}

const renderHomepage = (req, res, responseBody) => {
    let message = null
    if(!(responseBody instanceof Array)){
        message = "API lookup error"
        responseBody = []
    }else{
        if(!responseBody.length){
            message = "No places found nearby"
        }
    }

    res.render('locations-list',{
        title: 'Loc8r - find a place to work with wifi',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        },
        sidebar: "Looking for wifi and a seat? Loc8r helps you find places \
        to work when out and about. Perhaps with coffee, cake or a pint? \
        Let Loc8r help you find the place you're looking for.",
        locations: responseBody,message
        /*[
            {
                name: 'Starcups',
                address: '경기도 안성시 안성2동 중앙로 327',
                rating: 3,
                facilities: ['Hot drinks', 'Food', 'Premium wifi'],
                distance: '100m'
            },
            {
                name: 'Cafe Hero',
                address: '125 High Street, Reading, RG6 1PS',
                rating: 4,
                facilities: ['Hot drinks', 'Food', 'Premium wifi'],
                distance: '200m'
            },
            {
                name: 'Burger Queen',
                address: '125 High Street, Reading, RG6 1PS',
                rating: 2,
                facilities: ['Food', 'Premium wifi'],
                distance: '250m'
            }
        ]*/
    })
}

/* GET 'home' page */

const homelist = (req,res) => {
    const path = '/api/locations'
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'GET',
        json: {},
        qs: {
            lng: 126.964062,
            lat: 37.468769,
            maxDistance: 20000000
            /*lng: 1,
            lat: 1,
            maxDistance: 0.002*/
        }
    }
    request(requestOptions, (err, {statusCode}, body) => {
        let data = []
        if(statusCode === 200 && body.length){
            data = body.map((item) => {
                item.distance = formatDistance(item.distance)
                return item
            })
        }
        renderHomepage(req, res, data)
    })

    /*res.render('locations-list',{
        title: 'Loc8r - find a place to work with wifi',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        },
        locations: [
            {
                name: 'Starcups',
                address: '경기도 안성시 안성2동 중앙로 327',
                rating: 3,
                facilities: ['Hot drinks', 'Food', 'Premium wifi'],
                distance: '100m'
            },
            {
                name: 'Cafe Hero',
                address: '125 High Street, Reading, RG6 1PS',
                rating: 4,
                facilities: ['Hot drinks', 'Food', 'Premium wifi'],
                distance: '200m'
            },
            {
                name: 'Burger Queen',
                address: '125 High Street, Reading, RG6 1PS',
                rating: 2,
                facilities: ['Food', 'Premium wifi'],
                distance: '250m'
            }
        ]
    })*/
}

/* GET 'Location Info' page */

const renderDetailPage = (req, res, location) => {
    res.render('location-info', {
        title: location.name/*'Starcups'*/,
        pageHeader: {
            title: location.name/*'Loc8r'*/,
        },
        sidebar: {
            context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
            callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
        },
        location/*: {
            name: 'Starcups',
            address: '경기도 안성시 안성2동 중앙로 327',
            rating: 3,
            facilities: ['Hot drinks', 'Food', 'Premium wifi'],
            coords: { lat: 37.01309819684246, lng: 127.26339241513085 },
            openingTimes: [
                {
                    days: 'Monday - Friday',
                    opening: '7:00am',
                    closing: '7:00pm',
                    closed: false
                },
                {
                    days: 'Saturday',
                    opening: '8:00am',
                    closing: '5:00pm',
                    closed: false
                },
                {
                    days: 'Sunday',
                    closed: true
                }
            ],
            reviews: [
                {
                    author: '2018265019 김승민',
                    rating: 5,
                    timestamp: '16 July 2013',
                    reviewText: 'What a great place. I can\'t say enough good things about it.'
                },
                {
                    author: 'Charlie Chaplin',
                    rating: 3,
                    timestamp: '16 June 2013',
                    reviewText: 'It was okay. Coffee wasn\'t great, but the wifi was fast.'
                }
            ]
        }*/
    })
}

const showError = (req, res, status) => {
    let title = ''
    let content = ''
    if(status === 404) {
        title = '404, page not found',
        content = 'Oh dear. Looks like you can\'t find this page. Sorry.'
    }else{
        title = `${status}, something's gone wrong`
        content = 'something, somewhere, has gone just a little bit wrong'
    }
    res.status(status)
    res.render('generic-text',{
        title,
        content
    })
}

const getLocationInfo = (req, res, callback) => {
    const path = `/api/locations/${req.params.locationid}`
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'GET',
        json: {}
    }
    request(requestOptions, (err, {statusCode}, body) => {
        const data = body
        if(statusCode === 200){
            data.coords = {
                lng:body.coords[0],
                lat:body.coords[1]
            }
            callback(req, res, data)
        }else{
            showError(req, res, statusCode)
        }
    })
}

const locationInfo = (req,res) => {
    getLocationInfo(req, res,
        (req, res, responseData) => renderDetailPage(req, res, responseData)
    )
}

const renderReviewForm = (req, res, {name}) => {
    res.render('location-review-form',{
        title: `Review ${name} Starcups on Loc8r`,
        pageHeader: {title: `Review ${name}`},
        error: req.query.err
    })
}

/* GET 'Add review page */

const addReview = (req,res) => {
    getLocationInfo(req, res,
        (req, res, responseData) => renderReviewForm(req, res, responseData) 
    )
}

const doAddReview = (req, res) => {
    const locationid = req.params.locationid
    const path = `/api/locations/${locationid}/reviews`
    const postdata = {
        author: req.body.name,
        rating: parseInt(req.body.rating, 10),
        reviewText: req.body.review
    }
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'POST',
        json: postdata
    }
    if(!postdata.author || !postdata.rating || !postdata.reviewText){
        res.redirect(`/location/${locationid}/review/new?err=val`)
    }else{
        request(requestOptions, (err, {statusCode}, {name}) => {
            if(statusCode === 201){
                res.redirect(`/location/${locationid}`)
            }else if(statusCode === 400 && name && name === 'ValidationError'){
                res.redirect(`/location/${locationid}/review/new?err=val`)
            }else{
                showError(req, res, statusCode)
            }
        })
    }
}

module.exports = {
    homelist,
    locationInfo,
    addReview,
    doAddReview
}